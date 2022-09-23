import {TS, UP, DOWN, LEFT, RIGHT} from '../constants'
import Potion from '../tiles/Potion'
import { distance, point } from '../helpers'

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

    // Dash attributes
    this.dashedLast = Date.now()
    this.maxDashFrames = 12;
    this.currentDashFrame = 0;
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
  }

  move(){
    if(this.isFalling == true){
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
    if (this.colliding) speed = this.speed *.5
    if(this.queuedMovements.length > 0) this.facing = [...this.queuedMovements].pop()

    this.queuedMovements.forEach(direction => {
      if(direction == DOWN) this.y += speed
      if(direction == UP) this.y -= speed
      if(direction == LEFT) this.x -= speed
      if(direction == RIGHT) this.x += speed
    })

    let boundaryCollisions = this.boundary.boundaryCollisions(activeRoom.boundaries(), 0, 0)

    this.dashCollision()

    if (this.isDashing == false && boundaryCollisions.length > 0){
      let collisionPoint = boundaryCollisions[0].collisionPoint
      let collisionAngleRadians = this.boundary.angleInRadiansToTargetPoint(collisionPoint.x, collisionPoint.y, 0, 0) 

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
    if(this.correctingPosition && this.outOfBounds(0,0) == false) this.correctingPosition = false

    if(this.isFalling && this.outOfBounds(0,0) == false){
      this.isFalling = false
      this.sprite.yAdjust = 0
      this.sprite.xAdjust = 0
      this.sprite.sizescaleAdjust = 0
    } 

    if(this.isDashing == false && this.correctingPosition == false){
      if(this.outOfBounds(0,0)) this.x = this.lastValidLocation.x
      if(this.outOfBounds(0,0)) this.y = this.lastValidLocation.y
    } 
    
    // Check if in potion area
    let potions = activeRoom.tileArray.filter(tile => tile instanceof Potion);
    potions.forEach((potion) => {
        if(potion.inArea(this.x, this.y) && this.hitPoints < this.maxHitPoints){
            activeRoom.tileArray = activeRoom.tileArray.filter(tile => tile != potion );
            this.potionsConsumed += 1
            this.hitPoints = Math.min(this.hitPoints + 20, this.maxHitPoints) 
        }
    })

    let effectCollisions = this.boundary.boundaryCollisions(activeRoom.effectBounds(), 0, 0)
    if(effectCollisions.length > 0) effectCollisions[0].triggerEvent(this)

    this.queuedMovements = []
  }

  dash(afterDashStart = null){
    if(this.isFalling && Date.now() - this.fallTimer > 800) return
    if(Date.now() - this.dashedLast > 100){
      this.dashedLast = Date.now();
      this.currentDashFrame = 0;
      this.isDashing = true;
      this.dashDirection = this.facing

      if(afterDashStart != null) afterDashStart()
    } 
  }

  handleDash(){
    if(this.currentDashFrame == this.maxDashFrames){
      this.handleDashEnd()
    }else{
      this.currentDashFrame++;
      if(this.dashDirection == UP) this.y -= this.dashSpeed
      if(this.dashDirection == DOWN) this.y += this.dashSpeed
      if(this.dashDirection == LEFT) this.x -= this.dashSpeed
      if(this.dashDirection == RIGHT) this.x += this.dashSpeed

      this.dashCollision()
    }
  }

  dashCollision(){
    let boundaryCollisions = this.boundary.boundaryCollisions(activeRoom.boundaries(), 0, 0)

    if (this.isDashing && (boundaryCollisions.filter(boundary => boundary.cancelsDash).length > 0 || this.outOfMap(0,0))){
      this.x = this.lastValidLocation.x
      this.y = this.lastValidLocation.y

      this.handleDashEnd()
    }
  }

  handleDashEnd(){
    this.isDashing = false;
    if(this.outOfBounds(0,0) && this.canBeCorrected()) this.correctingPosition = true
    if(this.outOfBounds(0,0) && this.canBeCorrected() == false){
      this.isFalling = true
      this.fallTimer = Date.now()
    } 
  }

  canBeCorrected(){
    let canBeCorrected = true
    let collisions = this.boundary.boundaryCollisions(activeRoom.boundaries(), 0, 0)
    collisions.forEach(bound => {
      if(bound.containsPoint(point(this.x, this.y), 0,0) && bound.canBeFallenInto) canBeCorrected = false
    })
    return canBeCorrected
  }

  outOfMap(xAdjust, yAdjust){
    if (this.x+xAdjust>(activeRoom.width)*TS || this.x+xAdjust<0 ) return true
    if (this.y+yAdjust<TS || this.y+yAdjust>(activeRoom.height+1)*TS) return true
    return false
  }

  outOfBounds(xAdjust, yAdjust){
    let collisions = this.boundary.boundaryCollisions(activeRoom.boundaries(), xAdjust, yAdjust)

    if (collisions.length > 0) return true
    return this.outOfMap(xAdjust, yAdjust)
  }

  isMoving(){
    return this.queuedMovements.length > 0 || this.isDashing || this.correctingPosition || this.isFalling
  }
}


export default Movable