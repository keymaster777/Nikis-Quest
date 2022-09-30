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
    this.dash = this.dash
    this.handleDash = this.handleDash
    this.dashCollision = this.dashCollision
    this.isMoving = this.isMoving
    this.canBeCorrected = this.canBeCorrected
    this.handleDashEnd = this.handleDashEnd
    this.effectCollisions = this.effectCollisions
  }

  move(){
    if(this.isFalling === true){
      this.sprite.yAdjust += 1.2
      this.sprite.xAdjust += .1
      this.sprite.sizescaleAdjust -= .0001
      if (Date.now() - this.fallTimer > 2000) {
        this.isDashing = false
        this.takeDamage(10)
      }
      if (Date.now() - this.fallTimer > 500) return
    }


    this.lastValidLocation = point(this.x, this.y)
    let speed = this.isDashing ? this.dashSpeed : this.speed
    if (this.speedDebuff()) speed = this.speed * .8
    if (this.colliding) speed = this.speed *.5
    if(this.queuedMovements.length > 0) this.facing = [...this.queuedMovements].pop()

    this.queuedMovements.forEach(direction => {
      if(direction === DOWN) this.y += speed
      if(direction === UP) this.y -= speed
      if(direction === LEFT) this.x -= speed
      if(direction === RIGHT) this.x += speed
    })

    let boundaryCollisions = this.boundary.boundaryCollisions(this.collisionTargets())

    this.dashCollision()

    if (this.isDashing === false && boundaryCollisions.length > 0){
      let collisionPoint = boundaryCollisions[0].collisionPoint
      let collisionAngleRadians = this.boundary.angleInRadiansToTargetPoint(collisionPoint.x, collisionPoint.y)

      this.x=this.lastValidLocation.x
      this.y=this.lastValidLocation.y

      let newX = (Math.cos(collisionAngleRadians+Math.PI) * (this.speed*.5) + this.x)
      let newY = (Math.sin(collisionAngleRadians+Math.PI) * (this.speed*.5) + this.y)

      this.colliding = true
      this.x = newX
      this.y = newY
    } else {
      this.colliding = false
    }

    if(this.isDashing) this.handleDash()
    if(this.correctingPosition && this.outOfBounds() === false) this.correctingPosition = false

    if(this.isFalling && this.outOfBounds() === false){
      this.isFalling = false
      this.sprite.yAdjust = 0
      this.sprite.xAdjust = 0
      this.sprite.sizescaleAdjust = 0
    }

    if(this.isDashing === false && this.correctingPosition === false){
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

  dash(afterDashStart = null){
    if(this.isDashing || this.isFalling && Date.now() - this.fallTimer > 800) return
    if(Date.now() - this.dashedLast > 100){
      this.dashedLast = Date.now()
      this.currentDashFrame = 0
      this.isDashing = true
      this.dashDirection = this.facing

      if(afterDashStart !== null) afterDashStart()
    }
  }

  handleDash(){
    if(this.currentDashFrame === this.maxDashFrames){
      this.handleDashEnd()
    }else{
      this.currentDashFrame++
      if(this.dashDirection === UP) this.y -= this.dashSpeed
      if(this.dashDirection === DOWN) this.y += this.dashSpeed
      if(this.dashDirection === LEFT) this.x -= this.dashSpeed
      if(this.dashDirection === RIGHT) this.x += this.dashSpeed

      this.dashCollision()
    }
  }

  dashCollision(){
    let boundaryCollisions = this.boundary.boundaryCollisions(this.collisionTargets())

    if (this.isDashing && (boundaryCollisions.filter(boundary => boundary.cancelsDash).length > 0 || this.outOfMap())){
      this.x = this.lastValidLocation.x
      this.y = this.lastValidLocation.y

      this.handleDashEnd()
    }
  }

  handleDashEnd(){
    this.isDashing = false
    // TODO clean up boolean logic here
    if(this.outOfBounds() && this.canBeCorrected()) this.correctingPosition = true
    if(this.outOfBounds() && this.canBeCorrected() === false){
      this.isFalling = true
      this.fallTimer = Date.now()
    }
  }

  canBeCorrected(){
    let canBeCorrected = true
    let collisions = this.boundary.boundaryCollisions(this.collisionTargets())
    collisions.forEach(bound => {
      if(bound.containsPoint(point(this.x, this.y)) && bound.canBeFallenInto) canBeCorrected = false
    })
    return canBeCorrected
  }

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
    return this.queuedMovements.length > 0 || this.isDashing || this.correctingPosition || this.isFalling
  }
}


export default Movable