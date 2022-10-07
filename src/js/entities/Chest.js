import { TS } from "../constants"
import Killable from "../entityTraits/Killable"
import BoundingRectangle from "../boundingAreas/BoundingRectange"
import Goblin from "./Goblin"
import Chort from "./Chort"
import Potion from "./Potion"
import Sprite from "../Sprite"
import MovementBehavior from "../entityBehaviors/MovementBehavior"
import Coin from "./Coin"

class Chest{
  constructor(tileSizeX, tileSizeY){
    this.x = tileSizeX*TS+(Math.random()*10)-5
    this.y = tileSizeY*TS+(Math.random()*10)-5
    this.sizeMultiplier = 1

    this.spriteCoords = () => ({ x: this.x+(.5*TS), y: this.y+(TS) })
    this.sprite = new Sprite({
      coords: this.spriteCoords.bind(this),
      width: 16,
      height: 16,
      image: imgs.chest,
      numberOfFrames: 1,
      sizescale: .07,
    })

    let killable = new Killable({
      maxHitPoints: 24,
      maxDamageFrames: 18,
      onDeath: this.destroyChest
    })

    this.walksRecklessly = true
    let movementOptions = {
      speed: 0,
      maxKnockBackFrames: 4,
      knockBackInitialDistance: 4
    }
    this.movementBehavior = new MovementBehavior(this, movementOptions)

    this.boundaryCoords = () => ({ x: this.x+.15*TS, y: this.y+.45*TS })
    this.boundary = new BoundingRectangle({
      coords: this.boundaryCoords.bind(this),
      width: TS*0.7,
      height: TS*0.3,
      cancelsDash: true,
      isMovingBoundary: true,
    })

    this.hitBoxCoords = () => ({ x: this.x+.15*TS, y: this.y+.25*TS })
    this.hitBox = new BoundingRectangle({
      coords: this.hitBoxCoords.bind(this),
      width: TS*0.7,
      height: TS*0.4
    })

    this.potionsConsumed = 0
    this.name = "Chesterson the third"

    // compose killable into chest
    Object.assign(this, killable)
  }

  get depthBreakpoint(){ return this.y + 40}

  drinkPotion(){
    this.powerUp()
    this.hitPoints = this.maxHitPoints
    this.potionsConsumed += 1
    overlayManager.addBossBarOverlay()
  }

  powerUp(){
    if(this.potionsConsumed === 0){
      this.multiplySize(1.5)
      this.maxHitPoints = this.maxHitPoints*3
    }
  }

  multiplySize(multiplier){
    this.sprite.sizescale *= multiplier
    this.sprite.yAdjust += (.2*TS)*multiplier-.2*TS
    this.boundary.multiplySize(multiplier)
    this.hitBox.multiplySize(multiplier)
  }

  fullName(){
    return this.name
  }

  destroyChest(){
    activeRoom.chests = activeRoom.chests.filter(chest => chest !== this)
    player.chestsOpened += 1

    if(this.potionsConsumed > 0){
      if(this.isFalling) return
      [...Array(5)].forEach(() => {
        activeRoom.potions.push(new Potion(
          this.x+(Math.random()*30)-15,
          this.y+(Math.random()*30)-15,
          false
        ))
      });

      [...Array(5)].forEach(() => {
        let coin = new Coin(this.bodyCenter().x, this.y+(TS*.6), { spread: 30 })
        activeRoom.coins.push(coin)
      })
      activeRoom.coins.push(new Coin(this.bodyCenter().x, this.y, { value: 15 }))
    } else {
      let random = Math.random()
      if(random >= .95) activeRoom.monsters.push(new Goblin(this.x/TS, this.y/TS, true))
      if(random >= .9) activeRoom.monsters.push(new Chort(this.x/TS, this.y/TS))
      if(random < .9){
        activeRoom.potions.push(new Potion(this.x, this.y, false));
        [...Array(5)].forEach(() => {
          let coin = new Coin(this.bodyCenter().x, this.y+(TS*.6), { spread: 30 })
          activeRoom.coins.push(coin)
        })
      }
      if(random < .05) activeRoom.coins.push(new Coin(this.bodyCenter().x, this.y, { value: 15 }))
    }
  }

  bodyCenter(){
    return { x: this.x+.5*TS, y: this.y+.45*TS }
  }

  draw(){
    this.movementBehavior.move()
    this.sprite.draw()
    if(this.takingDamage) this.damagedAnimation()
  }
}

export default Chest
