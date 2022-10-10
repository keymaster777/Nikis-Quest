import { TS, UP, DOWN, LEFT, RIGHT } from "../constants"
import { point } from "../helpers"
import BoundingRegion from "../boundingAreas/BoundingRegion"

class MovementBehavior{
  constructor(entity, options){
    // Entity employing movement behavior
    this.entity = entity
    this.entity.isFalling = false
    this.entity.isDashing = false
    this.entity.isBeingKnockedBack = false
    this.entity.facing = DOWN

    this.speed = options.speed === undefined ? 2.5 : options.speed
    this.dashSpeed = options.dashSpeed || 0
    this.effectTargets = options.effectTargets || (() => activeRoom.effectEntities())
    this.queuedMovements = []
    this.lastValidLocation = point(0,0)
    this.correctingPosition = false
    this.disabledMovement = false

    // Knockback attributes
    this.canBeKnockedBack = options.canBeKnockedBack === undefined ? true : options.canBeKnockedBack
    this.knockBackAngle = 0
    this.currentKnockBackFrame = 0
    this.maxKnockBackFrames = options.maxKnockBackFrames || 6
    this.knockBackInitialDistance = options.knockBackInitialDistance || 6
    this.knockBackCurrentDistance = this.knockBackInitialDistance

    // Dash attributes
    this.dashedLast = Date.now()
    this.maxDashFrames = 12
    this.currentDashFrame = 0
    this.dashDirection = DOWN
  }

  get x(){ return this.entity.x }
  get y(){ return this.entity.y }
  set x(x){ this.entity.x = x}
  set y(y){ this.entity.y = y}
  get sprite(){ return this.entity.sprite }

  move(){
    this.lastValidLocation = point(this.x, this.y)
    if(this.queuedMovements.length === 0 && this.entity.isDashing) this.queuedMovements.push(this.entity.facing)


    if(this.shouldBeFalling() && !this.entity.isFalling) this.startFalling()
    if(this.shouldBeCorrected() && !this.isCorrecting) this.startCorrecting()

    if(this.canMove()){
      if(this.queuedMovements.length > 0) this.processQueuedMovements()
      if(this.outOfBounds() && this.shouldBeCorrected()) this.startCorrecting()
    }

    if(this.entity.isFalling) this.continueFalling()
    if(this.disabledMovement === false){
      if(this.isCorrecting) this.continueCorrecting()
      if(this.entity.isDashing) this.continueDashing()
      if(this.entity.isBeingKnockedBack) this.continueKnockBack()
    }

    if(this.shouldStayValid()){
      if(this.outOfBounds()) this.x = this.lastValidLocation.x
      if(this.outOfBounds()) this.y = this.lastValidLocation.y
    }

    this.effectCollisions()
    this.queuedMovements = []
  }

  effectCollisions(){
    if(this.entity.boundary === undefined) return
    this.effectTargets().forEach(entity => {
      if(this.entity.boundary.collidesWith(entity.effectBox)) entity.effectBox.triggerEvent(this.entity)
    })
  }

  currentSpeed(){
    let speed = this.entity.isDashing ? this.dashSpeed : this.speed
    if (this.entity.walksSlowInDark && activeRoom.torches.length === 0) speed = speed * .85
    if (this.entity.walksSlowWhenMaimed && this.entity.hitPoints < this.entity.maxHitPoints) speed = speed * .75
    if (this.entity.isFalling) speed = 0
    return speed
  }

  shouldStayValid(){
    if(this.entity.isDashing) return false
    if(this.entity.isBeingKnockedBack) return false
    if(this.entity.isFalling) return false
    if(this.isCorrecting) return false

    return true
  }

  canMove(){
    return this.entity.isBeingKnockedBack === false && this.disabledMovement === false
  }

  processQueuedMovements(){
    let speed = this.currentSpeed()
    if(this.entity.isAttacking !== true) this.entity.facing = [...this.queuedMovements].pop()

    this.queuedMovements.forEach(direction => {
      if(direction === DOWN) this.y += speed
      if(direction === UP) this.y -= speed
      if(direction === LEFT) this.x -= speed
      if(direction === RIGHT) this.x += speed
    })
  }

  // ---------------------------

  startFalling(){
    this.entity.isFalling = true
    this.entity.fallTimer = Date.now()
    this.isCorrecting = false
  }

  continueFalling(){
    this.suckIntoPit()
    this.sprite.yAdjust += 1.2
    this.sprite.sizescaleAdjust -= .0001

    let msFalling = Date.now() - this.entity.fallTimer
    if (msFalling > 2000) this.entity.takeTrueDamage(2)
    if (msFalling > 500 && !this.disabledMovement){
      this.disabledMovement = true
      this.entity.isDashing = false
      this.isCorrecting = false
    }

    if(!this.shouldBeFalling()) this.stopFalling()
  }

  stopFalling(){
    this.entity.isFalling = false
    this.sprite.yAdjust = 0
    this.sprite.sizescaleAdjust = 0
  }

  suckIntoPit(){
    let pitCollisions = this.activeCollisions().filter(bound => bound.canBeFallenInto)
    let probePoints = this.entity.boundary.probePoints()

    if(!BoundingRegion.pointCollisions(probePoints[UP], pitCollisions)) this.y += 3
    if(!BoundingRegion.pointCollisions(probePoints[DOWN], pitCollisions)) this.y -= 3
    if(!BoundingRegion.pointCollisions(probePoints[LEFT], pitCollisions)) this.x += 3
    if(!BoundingRegion.pointCollisions(probePoints[RIGHT], pitCollisions)) this.x -= 3
  }

  shouldBeFalling(){
    if(this.entity.isDashing || this.entity.boundary === undefined ) return false
    let collisions = this.entity.boundary.boundaryCollisions() // Intentionally bypassing activeCollissions
    if (collisions.length === 0) return false

    let pitFall = collisions.find(bound => bound.containsPoint(this.entity.boundary.centerPoint) && bound.canBeFallenInto)
    return pitFall !== undefined
  }

  // ---------------------------

  startDashing(){
    if(this.entity.isDashing || this.disabledMovement) return false
    if(Date.now() - this.dashedLast > 100){
      if(this.entity.isFalling) this.stopFalling()
      this.currentDashFrame = 0
      this.entity.isDashing = true
      return true
    }
    return false
  }

  continueDashing(){
    this.currentDashFrame++

    let collisions = this.activeCollisions()
    if(collisions.filter(boundary => boundary.cancelsDash).length > 0 || this.outOfMap()){
      this.x = this.lastValidLocation.x
      this.y = this.lastValidLocation.y
      this.currentDashFrame = this.maxDashFrames
    }
    if(this.currentDashFrame === this.maxDashFrames) this.stopDashing()
  }

  stopDashing(){
    this.dashedLast = Date.now()
    this.entity.isDashing = false
  }

  // ---------------------------

  startCorrecting(){
    this.isCorrecting = true
  }

  continueCorrecting(){
    let boundaries = this.activeCollisions()
    let speed = this.currentSpeed()
    if(boundaries.length === 0) return

    boundaries.forEach(boundary => {
      if(this.entity.cantBeShoved && boundary.entityBound) {
        this.x=this.lastValidLocation.x
        this.y=this.lastValidLocation.y
        return
      }

      let collisionAngleRadians = this.entity.boundary.collisionAngleToBound(boundary)
      let degrees = (collisionAngleRadians + Math.PI) * (180/Math.PI)

      if(degrees === 90 && this.queuedMovements.includes(UP)) this.y = this.lastValidLocation.y
      if(degrees === 270 && this.queuedMovements.includes(DOWN)) this.y = this.lastValidLocation.y
      if(degrees === 360 && this.queuedMovements.includes(LEFT)) this.x = this.lastValidLocation.x
      if(degrees === 180 && this.queuedMovements.includes(RIGHT)) this.x = this.lastValidLocation.x

      if(this.outOfBounds()){
        this.x=this.lastValidLocation.x
        this.y=this.lastValidLocation.y

        let newX = (Math.cos(collisionAngleRadians+Math.PI) * (speed*.5) + this.x)
        let newY = (Math.sin(collisionAngleRadians+Math.PI) * (speed*.5) + this.y)

        this.x = newX
        this.y = newY
      }
    })

    if(!this.outOfBounds()) this.stopCorrecting()
  }

  stopCorrecting(){
    this.isCorrecting = false
  }

  shouldBeCorrected(){
    if(this.outOfBounds() === false) return false
    if(this.entity.isDashing || this.entity.isFalling || this.entity.isBeingKnockedBack) return false

    return this.shouldBeFalling() === false
  }

  // ---------------------------

  startKnockBack(angle){
    if(this.entity.isFalling) return
    this.entity.isBeingKnockedBack = true
    this.knockBackAngle = angle
    this.currentKnockBackFrame = 0
    this.knockBackCurrentDistance = this.knockBackInitialDistance
  }

  continueKnockBack(){
    this.currentKnockBackFrame++
    let kbDistance = this.knockBackCurrentDistance

    if(this.disabledMovement === false){
      this.x=this.lastValidLocation.x
      this.y=this.lastValidLocation.y

      this.x = (Math.cos(this.knockBackAngle+Math.PI) * (-kbDistance) + this.x)
      this.y = (Math.sin(this.knockBackAngle+Math.PI) * (-kbDistance) + this.y)
    }

    this.knockBackCurrentDistance *= 0.75

    let collisions = this.activeCollisions()
    if(collisions.filter(boundary => boundary.cancelsDash).length > 0 || this.outOfMap()){
      this.x = this.lastValidLocation.x
      this.y = this.lastValidLocation.y
      this.currentKnockBackFrame = this.maxKnockBackFrames
    }

    if(this.currentKnockBackFrame === this.maxKnockBackFrames) this.stopKnockBack()
  }

  stopKnockBack(){
    this.entity.isBeingKnockedBack = false
  }

  // ---------------------------

  activeCollisions(){
    if(this.entity.boundary === undefined) return []

    let collisionTargets = activeRoom.boundaries()

    if(this.entity.isDashing){
      collisionTargets = BoundingRegion.dashCancelling(collisionTargets)
    }

    if(this.entity.walksRecklessly){
      collisionTargets = BoundingRegion.canNotBeFallenInto(collisionTargets)
    }

    return this.entity.boundary.boundaryCollisions(collisionTargets)
  }

  outOfMap(){
    if (this.x>(activeRoom.width)*TS || this.x<0 ) return true
    if (this.y<TS || this.y>(activeRoom.height+1)*TS) return true
    return false
  }

  outOfBounds(){
    let collisions = this.activeCollisions()
    if (collisions.length > 0) return true
    return this.outOfMap()
  }

  isMoving(){
    if (this.queuedMovements.length > 0) return true
    return this.entity.isDashing || this.isCorrecting || this.entity.isFalling
  }

  setupInputMovements(){
    if(input.isDown("s")) this.queuedMovements.push(DOWN)
    if(input.isDown("w")) this.queuedMovements.push(UP)
    if(input.isDown("a")) this.queuedMovements.push(LEFT)
    if(input.isDown("d")) this.queuedMovements.push(RIGHT)
  }

  setupProximityMovements(target){
    if(target.hitPoints <= 0) return
    if (target.y < this.y) this.queuedMovements.push(UP)
    if (target.y > this.y) this.queuedMovements.push(DOWN)
    if (target.x < this.x-5) this.queuedMovements.push(LEFT)
    if (target.x > this.x+5) this.queuedMovements.push(RIGHT)
  }
}


export default MovementBehavior