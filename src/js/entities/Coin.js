import { TS } from "../constants"
import BoundingElliptic from "../boundingAreas/BoundingElliptic"
import Sprite from "../Sprite"
import MovementBehavior from "../entityBehaviors/MovementBehavior"
import { distance } from "../helpers"

class Coin{
  constructor(x, y, options = {}){
    let spread = options.spread || 20
    this.value = options.value || 1

    this.x = x+(Math.random()*spread*2)-spread
    this.y = y+(Math.random()*spread*2)-spread

    this.effectBoxCoords = () => ({ x: this.x, y: this.y-5 })
    this.effectBox = new BoundingElliptic({
      coords: this.effectBoxCoords.bind(this),
      xSemiAxis: .12*TS,
      ySemiAxis: .06*TS,
      triggerEvent: ((entity) => this.stepOnCoin(entity, this))
    })

    this.spriteCoords = () => ({ x: this.x, y: this.y })
    this.sprite = new Sprite({
      coords: this.spriteCoords.bind(this),
      width: 16,
      height: 16,
      image: imgs.coin,
      numberOfFrames: 4,
      sizescale: .03,
    })

    let movementOptions = {
      speed: 0,
      maxKnockBackFrames: 10,
      knockBackInitialDistance: 10,
    }
    this.movementBehavior = new MovementBehavior(this, movementOptions)

    if(this.value >= 10) this.multiplySize(this.value/5)
  }

  get depthBreakpoint(){ return this.y-10}

  stepOnCoin(entity, targetCoin){
    if(entity !== player) return
    player.coins += targetCoin.value
    activeRoom.coins = activeRoom.coins.filter(coin => coin !== targetCoin)
  }

  multiplySize(multiplier){
    this.sprite.sizescale *= multiplier
    this.sprite.yAdjust += (.2*TS)*multiplier-.2*TS
    this.effectBox.multiplySize(multiplier)
  }

  bodyCenter(){
    return { x: this.x, y: this.y }
  }

  move(){
    if(!this.isBeingKnockedBack && distance(this.x, this.y, player.x, player.y) < TS*1.75){
      this.movementBehavior.speed += .18
    }
    this.movementBehavior.setupProximityMovements(player)
    this.movementBehavior.move()
  }

  draw(){
    this.move()
    this.sprite.draw()
  }
}

export default Coin
