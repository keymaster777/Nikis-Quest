import { TS } from "../constants"
import Killable from "../entityTraits/Killable"
import Movable from "../entityTraits/Movable"
import BoundingRectangle from "../boundingAreas/BoundingRectange"
import Goblin from "./Goblin"
import Chort from "./Chort"
import Potion from "./Potion"

class Chest{
  constructor(tileSizeX, tileSizeY){
    this.x = tileSizeX*TS+(Math.random()*10)-5
    this.y = tileSizeY*TS+(Math.random()*10)-5
    this.depthBreakpoint = this.y+40
    this.sizeMultiplier = 1

    let killable = new Killable({
      maxHitPoints: 15,
      maxDamageFrames: 18,
      onDeath: this.destroyChest
    })

    let movable = new Movable({
      speed: 0,
      maxKnockBackFrames: 4,
      knockBackInitialDistance: 3,
      stuckToFloor: true,
    })

    this.boundaryCoords = () => ({ x: this.x+.15*TS, y: this.y+.45*TS })
    this.boundary = new BoundingRectangle({
      coords: this.boundaryCoords.bind(this),
      width: TS*0.7,
      height: TS*0.3,
      cancelsDash: true,
    })

    this.hitBoxCoords = () => ({ x: this.x+.15*TS, y: this.y+.25*TS })
    this.hitBox = new BoundingRectangle({
      coords: this.hitBoxCoords.bind(this),
      width: TS*0.7,
      height: TS*0.4
    })

    this.potionsConsumed = 0
    this.name = ""

    // compose killable into chest
    Object.assign(this, killable, movable)
  }

  drinkPotion(){
    overlayManager.addBossBarOverlay()
    this.powerUp()
    this.hitPoints = this.maxHitPoints
    this.potionsConsumed += 1
  }

  powerUp(){
    if(this.potionsConsumed === 0){
      this.name = "Chesterson the third"
      this.multiplySize(2)
      this.maxHitPoints = this.maxHitPoints*3
      this.collisionTargets = (() => activeRoom.boundaries().filter(bound => bound.cancelsDash === true))
    }
  }

  multiplySize(multiplier){
    this.boundary.multiplySize(multiplier)
    this.hitBox.multiplySize(multiplier)
    this.sizeMultiplier *= multiplier
  }

  fullName(){
    return this.name
  }

  destroyChest(){
    console.log(activeRoom.chests)

    activeRoom.chests = activeRoom.chests.filter(chest => chest !== this)
    player.chestsOpened += 1

    if(this.potionsConsumed > 0){
      [...Array(4)].forEach(() => {
        activeRoom.potions.push(new Potion(
          this.x+(Math.random()*30)-15,
          this.y+(Math.random()*30)-15,
          false
        ))
      })
    } else {
      console.log("getting in here")
      let random = Math.random()
      if(random >= .95){
        activeRoom.monsters.push(new Goblin(this.x/TS, this.y/TS, true))
      }
      if(random >= .9){
        activeRoom.monsters.push(new Chort(this.x/TS, this.y/TS))
      }
      if(random < .9){
        activeRoom.potions.push(new Potion(this.x, this.y, false))
      }
    }
  }

  bodyCenter(){
    return { x: this.x+.5*TS, y: this.y+.45*TS }
  }

  draw(){
    this.move()
    ctx.drawImage(
      imgs.chest,
      this.x-(.05*TS*(this.sizeMultiplier-1)),
      this.y-(.5*TS*(this.sizeMultiplier-1)),
      TS*this.sizeMultiplier,
      TS*this.sizeMultiplier
    )
    if(this.takingDamage) this.damagedAnimation()
  }
}

export default Chest
