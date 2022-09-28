import Tile from "./Tile";
import { TS } from "../constants"
import Potion from "../Potion";
import Goblin from "../monsters/Goblin";
import Killable from "../traits/Killable";
import BoundingRectangle from "../boundingAreas/BoundingRectange";

class Chest extends Tile{
  constructor(x, y){
    super(imgs.chest, "*", x, y);
    this.obstructing = true;
    this.depthBreakpoint = this.y*TS+40

    let killable = new Killable({
      maxHitPoints: 15,
      maxDamageFrames: 18,
      isATile: true,
      onDeath: this.destroyChest 
    })

    this.boundaryCoords = () => ({x: this.x*TS+.15*TS, y: this.y*TS+.45*TS})
    this.boundary = new BoundingRectangle({
      coords: this.boundaryCoords.bind(this),
      width: TS*0.7,
      height: TS*0.4,
      cancelsDash: true,
    })

    this.hitBoxCoords = () => ({x: this.x*TS+.15*TS, y: this.y*TS+.35*TS})
    this.hitBox = new BoundingRectangle({
      coords: this.hitBoxCoords.bind(this),
      width: TS*0.7,
      height: TS*0.3
    })

    // compose killable into chest
    Object.assign(this, killable)
  }

  destroyChest(){
    activeRoom.staticBoundaries = activeRoom.staticBoundaries.filter(boundary => boundary != this.boundary)
    activeRoom.tileArray = activeRoom.tileArray.filter(tile => tile != this)
    player.chestsOpened += 1
    let random = Math.random();
    if(random >= .9){
      activeRoom.monsters.push(new Goblin(this.x, this.y))
      activeRoom.monsters.push(new Goblin(this.x, this.y))
    }
    if(random > .7){
      console.log("Stamina Pot spawn")
    } else {
      activeRoom.potions.push(new Potion(this.x, this.y));
    }
  }

  draw(){
    super.draw()
    if(this.takingDamage) this.damagedAnimation();
  }
}

export default Chest