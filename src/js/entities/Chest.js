import { TS } from "../constants"
import Killable from "../entityTraits/Killable"
import BoundingRectangle from "../boundingAreas/BoundingRectange"
import Goblin from "./Goblin"
import Chort from "./Chort"
import Potion from "./Potion"

class Chest{
  constructor(tileSizeX, tileSizeY){
    this.x = tileSizeX*TS+(Math.random()*10)-5
    this.y = tileSizeY*TS+(Math.random()*10)-5
    this.depthBreakpoint = this.y+40

    let killable = new Killable({
      maxHitPoints: 15,
      maxDamageFrames: 18,
      onDeath: this.destroyChest
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

    // compose killable into chest
    Object.assign(this, killable)
  }

  destroyChest(){
    activeRoom.chests = activeRoom.chests.filter(chest => chest !== this)
    player.chestsOpened += 1
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

  draw(){
    ctx.drawImage(imgs.chest, this.x, this.y, TS,TS)
    if(this.takingDamage) this.damagedAnimation()
  }
}

export default Chest
