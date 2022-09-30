import { TS } from "../constants"
import BoundingElliptic from "../boundingAreas/BoundingElliptic"

class Potion{
  constructor(x, y, usingTileScaleCoords = true){
    if(usingTileScaleCoords){
      this.x = x*TS+(Math.random()*20)-10
      this.y = y*TS+(Math.random()*20)-10
    } else {
      this.x = x
      this.y = y
    }

    this.depthBreakpoint = this.y + .66*TS

    this.effectBox = new BoundingElliptic({
      coords: (() => ({ x: this.x+.5*TS, y: this.y+.65*TS })),
      xSemiAxis: .3*TS,
      ySemiAxis: .15*TS,
      triggerEvent: ((entity) => this.stepOnPotion(entity, this))
    })
  }

  stepOnPotion(entity, targetPotion){
    if(entity.hitPoints < entity.maxHitPoints && entity.hitPoints > 0){
      activeRoom.potions = activeRoom.potions.filter(potion => potion !== targetPotion)
      entity.drinkPotion()
    }
  }

  draw(){
    ctx.drawImage(imgs.potion, this.x, this.y, TS,TS)
  }
}

export default Potion
