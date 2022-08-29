import {TS, UP, DOWN, LEFT, RIGHT} from '../constants'
import Potion from '../tiles/Potion'
import { distance } from '../helpers'

class Movable{
  constructor(options){
    this.speed = options.speed || 2.5
    this.dashSpeedMultiplier = options.dashSpeedMultiplier || 1
    this.queuedMovements = []
    this.facing = DOWN

    // Dash attributes
    this.dashedLast = Date.now()
    this.maxDashFrames = 10;
    this.currentDashFrame = 0;
    this.isDashing = false

    // Methods
    this.move = this.move
    this.outOfBounds = this.outOfBounds
    this.outOfMap = this.outOfMap
    this.getClosestValidSpot = this.getClosestValidSpot
    this.moveToClosestValidSpot = this.moveToClosestValidSpot
    this.dash = this.dash
    this.updateDashStatus = this.updateDashStatus
  }

  move(){
    let pendingMovement = {x: 0, y: 0}
    let speed = this.isDashing ? this.speed*this.dashSpeedMultiplier : this.speed
    this.facing = [...this.queuedMovements].pop()

    this.queuedMovements.forEach(direction => {
        switch(direction){
        case DOWN:
            pendingMovement.y = speed
            break;
        case UP:
            pendingMovement.y = -speed
            break;
        case LEFT:
            pendingMovement.x = -speed
            break;
        case RIGHT:
            pendingMovement.x = speed
            break;
        }
    })

    let boundaryCollisions = this.boundary.boundaryCollisions(activeRoom.boundaries(), pendingMovement.x, pendingMovement.y)
    for (let i = 0; boundaryCollisions.length > 0 && i < 50; i++){
      let selfReferencePoint = this.boundary.collisionReferencePoint
      let offendingReferencePoint = boundaryCollisions[0].collisionReferencePoint

      let correctiveRun = selfReferencePoint.x - offendingReferencePoint.x
      let correctiveRise = selfReferencePoint.y - offendingReferencePoint.y

      pendingMovement.x += correctiveRun*.1

      pendingMovement.y += correctiveRise*.1
      boundaryCollisions = this.boundary.boundaryCollisions(activeRoom.boundaries(), pendingMovement.x, pendingMovement.y)
    } 

    if(Math.abs(pendingMovement.x)+Math.abs(pendingMovement.y) > 1){
      if(this.outOfBounds(pendingMovement.x, pendingMovement.y) == false){
        this.x += pendingMovement.x
        this.y += pendingMovement.y
      } else {
        if (this.outOfBounds(pendingMovement.x, 0) == false){
          this.x += pendingMovement.x
        }
        if (this.outOfBounds(0, pendingMovement.y) == false){
          this.y += pendingMovement.y
        }
      }
    }  
    /*
    if (this.outOfBounds(pendingMovement.x, pendingMovement.y) == false){
        if(Math.abs(pendingMovement.x)+Math.abs(pendingMovement.y) > 1){
            this.x += pendingMovement.x
            this.y += pendingMovement.y
        }
    }
    */
        
    // Check if in potion area
    let potions = activeRoom.tileArray.filter(tile => tile instanceof Potion);
    potions.forEach((potion) => {
        if(potion.inArea(this.x, this.y) && this.hitPoints < this.maxHitPoints){
            activeRoom.tileArray = activeRoom.tileArray.filter(tile => tile != potion );
            this.potionsConsumed += 1
            this.hitPoints = Math.min(this.hitPoints + 20, this.maxHitPoints) 
        }
    })


    this.queuedMovements = []
  }

  dash(afterDash = null){
    if(Date.now() - this.dashedLast > 500){
      this.dashedLast = Date.now();
      this.dashEndLocation = [0,0];
      this.currentDashFrame = 0;
      this.isDashing = true;
      switch(this.facing){
          case RIGHT:
              this.dashEndLocation = this.getClosestValidSpot(2.2*TS, 0);
              break;
          case LEFT:
              this.dashEndLocation = this.getClosestValidSpot(-2.2*TS, 0);
              break;
          case UP:
              this.dashEndLocation = this.getClosestValidSpot(0, -2.2*TS);
              break;
          case DOWN:
              this.dashEndLocation = this.getClosestValidSpot(0, 2.2*TS);
              break;
      }
      this.rise = this.y-this.dashEndLocation["y"];
      this.run = this.x-this.dashEndLocation["x"];

      if(afterDash != null) afterDash()
    } 
  }

  updateDashStatus(){
    if(this.currentDashFrame == this.maxDashFrames){
      this.moveToClosestValidSpot();
      this.isDashing = false;
    }else{
      this.x -= this.run/this.maxDashFrames
      this.y -= this.rise/this.maxDashFrames;
      this.currentDashFrame++;
    }
  }

  outOfMap(xAdjust, yAdjust){
    if (this.x+xAdjust>(activeRoom.width)*TS || this.x+xAdjust<0 ) return true
    if (this.y+yAdjust<TS || this.y+yAdjust>(activeRoom.height+1)*TS) return true
    return false
  }

  outOfBounds(xAdjust = 0, yAdjust = 0){
    if (this.boundary.boundaryCollisions(activeRoom.boundaries(), xAdjust, yAdjust).length > 0) return true
    return this.outOfMap(xAdjust, yAdjust)
  }
  
  getClosestValidSpot(xAdjust=0, yAdjust=0){
    let adjustment = {x: xAdjust, y: yAdjust};
    for( let i = 0; this.outOfBounds(adjustment.x, adjustment.y) && i < 1000; i+=5){
        if(!this.outOfBounds(xAdjust-i, yAdjust)) adjustment.x+=-i
        else if(!this.outOfBounds(xAdjust-i*.5, yAdjust-i*.5)){ adjustment.x +=-i*.5; adjustment.y+=-i*.5 }
        else if(!this.outOfBounds(xAdjust, yAdjust+i)) adjustment.y+=i;
        else if(!this.outOfBounds(xAdjust+i*.5, yAdjust-i*.5)){ adjustment.x+=i*.5; adjustment.y+=-i*.5 }
        else if(!this.outOfBounds(xAdjust+i, yAdjust)) adjustment.x+=i;
        else if(!this.outOfBounds(xAdjust+i*.5, yAdjust+i*.5)){ adjustment.x+=i*.5; adjustment.y+=i*.5 }
        else if(!this.outOfBounds(xAdjust, yAdjust-i)) adjustment.y+=-i;
        else if(!this.outOfBounds(xAdjust-i*.5, yAdjust+i*.5)){ adjustment.x+=-i*.5; adjustment.y+=i*.5 }
    }
    return {x: this.x+adjustment.x, y: this.y+adjustment.y};
  }

  moveToClosestValidSpot(){
    let closestLocation = this.getClosestValidSpot();
    this.x=closestLocation["x"];
    this.y=closestLocation["y"];
  }
}


export default Movable