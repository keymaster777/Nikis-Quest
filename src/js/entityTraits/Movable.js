import { TS, UP, DOWN, LEFT, RIGHT } from "../constants"
import { point } from "../helpers"

class Movable{
  constructor(options){
    this.speed = options.speed || 2.5
    this.dashSpeed = options.dashSpeed || 0
    this.queuedMovements = []
    this.facing = DOWN
    this.lastValidLocation = point(0,0)
    this.colliding = false
    this.correctingPosition = false
    this.isFalling = false
    this.fallTimer = Date.now()
    this.speedDebuff = options.speedDebuff || (() => false)
    this.collisionTargets = options.collisionTargets || (() => activeRoom.boundaries())
    this.effectTargets = options.effectTargets || (() => activeRoom.effectEntities())
    this.disabledMovement = false
    this.stuckToFloor = options.stuckToFloor === undefined ? false : options.stuckToFloor

    // Knockback attributes
    this.canBeKnockedBack = options.canBeKnockedBack === undefined ? true : options.canBeKnockedBack
    this.isBeingKnockedBack = false
    this.knockBackAngle = 0
    this.currentKnockBackFrame = 0
    this.maxKnockBackFrames = options.maxKnockBackFrames || 6
    this.knockBackInitialDistance = options.knockBackInitialDistance || 6
    this.knockBackCurrentDistance = this.knockBackInitialDistance

    // Dash attributes
    this.dashedLast = Date.now()
    this.maxDashFrames = 12
    this.currentDashFrame = 0
    this.isDashing = false
    this.dashDirection = DOWN

    // Methods
    this.move = this.move
    this.outOfBounds = this.outOfBounds
    this.outOfMap = this.outOfMap
    this.isMoving = this.isMoving
    this.canBeCorrected = this.canBeCorrected
    this.effectCollisions = this.effectCollisions
    this.startFalling = this.startFalling
    this.continueFalling = this.continueFalling
    this.stopFalling = this.stopFalling
    this.startDashing = this.startDashing
    this.continueDashing = this.continueDashing
    this.stopDashing = this.stopDashing
    this.startCorrecting = this.startCorrecting
    this.continueCorrecting = this.continueCorrecting
    this.stopCorrecting = this.stopCorrecting
    this.currentSpeed = this.currentSpeed
    this.processQueuedMovements = this.processQueuedMovements
    this.startKnockBack = this.startKnockBack
    this.continueKnockBack = this.continueKnockBack
    this.stopKnockBack = this.stopKnockBack
  }

  move(){
    this.lastValidLocation = point(this.x, this.y)

    if(this.isBeingKnockedBack === false && this.disabledMovement === false ){
      if(this.queuedMovements.length > 0) this.processQueuedMovements()
      if(this.outOfBounds() && this.canBeCorrected()) this.startCorrecting()
    }

    if(this.isFalling) this.continueFalling()
    if(this.disabledMovement === false){
      if(this.isCorrecting) this.continueCorrecting()
      if(this.isDashing) this.continueDashing()
      if(this.isBeingKnockedBack) this.continueKnockBack()
    }

    if(this.stuckToFloor || (!this.isDashing && !this.isCorrecting && !this.isBeingKnockedBack)){
      if(this.outOfBounds()) this.x = this.lastValidLocation.x
      if(this.outOfBounds()) this.y = this.lastValidLocation.y
    }

    this.effectCollisions()
    this.queuedMovements = []
  }

  effectCollisions(){
    this.effectTargets().forEach(entity => {
      if(this.boundary.collidesWith(entity.effectBox)) entity.effectBox.triggerEvent(this)
    })
  }

  currentSpeed(){
    let speed = this.isDashing ? this.dashSpeed : this.speed
    if (this.speedDebuff()) speed = speed * .8
    return speed
  }

  processQueuedMovements(){
    let speed = this.currentSpeed()
    this.facing = [...this.queuedMovements].pop()

    this.queuedMovements.forEach(direction => {
      if(direction === DOWN) this.y += speed
      if(direction === UP) this.y -= speed
      if(direction === LEFT) this.x -= speed
      if(direction === RIGHT) this.x += speed
    })
  }

  // ---------------------------

  startFalling(){
    this.isFalling = true
    this.fallTimer = Date.now()
  }

  continueFalling(){
    this.sprite.yAdjust += 1.2
    this.sprite.sizescaleAdjust -= .0001

    let msFalling = Date.now() - this.fallTimer
    if (msFalling > 2000) this.takeDamage(10)
    if (msFalling > 500 && !this.disabledMovement){
      this.disabledMovement = true
      this.isDashing = false
      this.isCorrecting = false
    }

    if(!this.outOfBounds()) this.stopFalling()
  }

  stopFalling(){
    this.isFalling = false
    this.sprite.yAdjust = 0
    this.sprite.sizescaleAdjust = 0
  }

  // ---------------------------

  startDashing(afterDashStart = null){
    if(this.isDashing || this.disabledMovement) return

    if(Date.now() - this.dashedLast > 100){
      if(this.isFalling) this.stopFalling()
      this.dashedLast = Date.now()
      this.currentDashFrame = 0
      this.isDashing = true
      this.dashDirection = this.facing

      if(afterDashStart !== null) afterDashStart()
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
    this.isDashing = false
    if(this.outOfBounds()){
      if(this.canBeCorrected()){
        this.startCorrecting()
      } else {
        this.startFalling()
      }
    }
  }

  // ---------------------------

  startCorrecting(){
    this.isCorrecting = true
  }

  continueCorrecting(){
    let boundaryCollisions = this.boundary.boundaryCollisions(this.collisionTargets())
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

  canBeCorrected(){
    if(this.isDashing) return false
    let canBeCorrected = true
    let collisions = this.boundary.boundaryCollisions(this.collisionTargets())
    collisions.forEach(bound => {
      if(bound.containsPoint(point(this.x, this.y)) && bound.canBeFallenInto) canBeCorrected = false
    })
    return canBeCorrected
  }

  // ---------------------------

  startKnockBack(angle){
    this.isBeingKnockedBack = true
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
    this.isBeingKnockedBack = false
    if(this.outOfBounds() && !this.stuckToFloor){
      if(this.canBeCorrected()){
        this.startCorrecting()
      } else {
        this.startFalling()
      }
    }
  }

  // ---------------------------

  outOfMap(){
    if (this.x>(activeRoom.width)*TS || this.x<0 ) return true
    if (this.y<TS || this.y>(activeRoom.height+1)*TS) return true
    return false
  }

  outOfBounds(){
    let collisions = this.boundary.boundaryCollisions(this.collisionTargets())
    if (collisions.length > 0) return true
    return this.outOfMap()
  }

  isMoving(){
    return this.queuedMovements.length > 0 || this.isDashing || this.isCorrecting || this.isFalling
  }
}


export default Movable