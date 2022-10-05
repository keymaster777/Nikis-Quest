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

    this.speed = options.speed || 2.5
    this.dashSpeed = options.dashSpeed || 0
    this.collisionTargets = options.collisionTargets || (() => activeRoom.boundaries())
    this.effectTargets = options.effectTargets || (() => activeRoom.effectEntities())
    this.stuckToFloor = options.stuckToFloor === undefined ? false : options.stuckToFloor
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
  get boundary(){ return this.entity.boundary }
  get sprite(){ return this.entity.sprite }

  move(){
    this.lastValidLocation = point(this.x, this.y)
    if(this.shouldBeCorrected() && !this.isCorrecting) this.startCorrecting()
    if(this.shouldBeFalling() && !this.entity.isFalling) this.startFalling()

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
    this.effectTargets().forEach(entity => {
      if(this.boundary.collidesWith(entity.effectBox)) entity.effectBox.triggerEvent(this.entity)
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
    if(this.stuckToFloor === true) return true

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
  }

  continueFalling(){
    this.suckIntoPit()
    this.sprite.yAdjust += 1.2
    this.sprite.sizescaleAdjust -= .0001

    let msFalling = Date.now() - this.entity.fallTimer
    if (msFalling > 2000) this.entity.takeDamage(10)
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
    let pitCollisions = this.collisionTargets().filter(bound => bound.canBeFallenInto)
    let probePoints = this.boundary.probePoints()

    if(!BoundingRegion.pointCollisions(probePoints[UP], pitCollisions)) this.y += 3
    if(!BoundingRegion.pointCollisions(probePoints[DOWN], pitCollisions)) this.y -= 3
    if(!BoundingRegion.pointCollisions(probePoints[LEFT], pitCollisions)) this.x += 3
    if(!BoundingRegion.pointCollisions(probePoints[RIGHT], pitCollisions)) this.x -= 3
  }

  shouldBeFalling(){
    if(this.entity.isDashing || this.isCorrecting) return false
    let collisions = this.boundary.boundaryCollisions(activeRoom.boundaries())
    if (collisions.length === 0) return false

    let pitFall = collisions.find(bound => bound.containsPoint(point(this.x, this.y)) && bound.canBeFallenInto)
    return pitFall !== undefined
  }

  // ---------------------------

  startDashing(direction){
    if(this.entity.isDashing || this.disabledMovement) return
    this.dashStartSpot = { x: this.x, y: this.y }
    if(Date.now() - this.dashedLast > 100){
      if(this.entity.isFalling) this.stopFalling()
      this.dashedLast = Date.now()
      this.currentDashFrame = 0
      this.entity.isDashing = true
      this.dashDirection = direction
    }
  }

  continueDashing(){
    this.currentDashFrame++
    if(this.disabledMovement === false){
      if(this.dashDirection === UP) this.y -= this.dashSpeed
      if(this.dashDirection === DOWN) this.y += this.dashSpeed
      if(this.dashDirection === LEFT) this.x -= this.dashSpeed
      if(this.dashDirection === RIGHT) this.x += this.dashSpeed
    }

    let collisions = this.boundary.boundaryCollisions(this.collisionTargets())
    if(collisions.filter(boundary => boundary.cancelsDash).length > 0 || this.outOfMap()){
      this.x = this.lastValidLocation.x
      this.y = this.lastValidLocation.y
      this.currentDashFrame = this.maxDashFrames
    }
    if(this.currentDashFrame === this.maxDashFrames) this.stopDashing()
  }

  stopDashing(){
    this.entity.isDashing = false
  }

  // ---------------------------

  startCorrecting(){
    this.isCorrecting = true
  }

  continueCorrecting(){
    let boundaryCollisions = this.entity.boundary.boundaryCollisions(this.newCollisionTargets())
    let speed = this.currentSpeed()

    if (boundaryCollisions.length > 0){
      let collisionPoint = boundaryCollisions[0].collisionPoint
      let collisionAngleRadians = this.boundary.angleInRadiansToTargetPoint(collisionPoint.x, collisionPoint.y)
      let angle = (collisionAngleRadians + Math.PI) * (180/Math.PI)

      if(angle === 90 && this.queuedMovements.includes(UP)) this.y = this.lastValidLocation.y
      if(angle === 270 && this.queuedMovements.includes(DOWN)) this.y = this.lastValidLocation.y
      if(angle === 360 && this.queuedMovements.includes(LEFT)) this.x = this.lastValidLocation.x
      if(angle === 180 && this.queuedMovements.includes(RIGHT)) this.x = this.lastValidLocation.x

      if(this.outOfBounds()){
        this.x=this.lastValidLocation.x
        this.y=this.lastValidLocation.y

        let newX = (Math.cos(collisionAngleRadians+Math.PI) * (speed*.5) + this.x)
        let newY = (Math.sin(collisionAngleRadians+Math.PI) * (speed*.5) + this.y)

        this.x = newX
        this.y = newY
      }
    }

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

    let collisions = this.boundary.boundaryCollisions(this.collisionTargets())
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

  newCollisionTargets(){
    let collisionTargets = activeRoom.boundaries()
    if(this.entity.isDashing) collisionTargets = BoundingRegion.dashCancelling(collisionTargets)
    if(this.entity.walksRecklessly) collisionTargets = BoundingRegion.canNotBeFallenInto(collisionTargets)

    return collisionTargets
  }

  outOfMap(){
    if (this.x>(activeRoom.width)*TS || this.x<0 ) return true
    if (this.y<TS || this.y>(activeRoom.height+1)*TS) return true
    return false
  }

  outOfBounds(){
    let collisions = this.boundary.boundaryCollisions(this.newCollisionTargets())
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
    if (target.y < this.y) this.queuedMovements.push(UP)
    if (target.y > this.y) this.queuedMovements.push(DOWN)
    if (target.x < this.x-5) this.queuedMovements.push(LEFT)
    if (target.x > this.x+5) this.queuedMovements.push(RIGHT)
  }
}


export default MovementBehavior