import {TS} from "./constants"
import BoundingElliptic from "./boundingAreas/BoundingElliptic";

class Potion{
  constructor(tileSizeX, tileSizeY){
    this.x = tileSizeX*TS
    this.y = tileSizeY*TS 
    this.depthBreakpoint = this.y + .66*TS
    this.healAmount = 20

    this.effectBox = new BoundingElliptic({
      coords: (()=> ({x: this.x+.5*TS, y: this.y+.65*TS})),
      xSemiAxis: .3*TS,
      ySemiAxis: .15*TS,
      triggerEvent: ((entity) => this.stepOnPotion(entity, this))
    })
  }

  stepOnPotion(entity, targetPotion){
    if(entity.hitPoints < entity.maxHitPoints){
      activeRoom.potions = activeRoom.potions.filter(potion => potion != targetPotion);
      entity.hitPoints = Math.min(entity.hitPoints + this.healAmount, entity.maxHitPoints)
      if (entity == player) player.potionsConsumed += 1
      if (activeRoom.monsters.find(monster => monster == entity)) entity.powerUp()
    }
  }

  draw(){
    ctx.drawImage(imgs.potion, this.x, this.y, TS,TS);
  }
}

export default Potion
