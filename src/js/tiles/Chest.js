import Tile from "./Tile";
import { TS } from "../constants"
import Potion from "./Potion";
import Monster from "../Monster";
import Level from "../Level";

class Chest extends Tile{
  constructor(x, y){
    super(imgs.chest, "*", x, y);
    this.obstructing = true;
    this.hitPoints = 15;
    this.takingDamage = false;
    this.maxDamageFrames = 18;
  }

  animations(){
    if(this.takingDamage) this.damageAnimation();
  }

  damageAnimation(){
    if(this.currentDamageFrame == this.maxDamageFrames){
      this.takingDamage = false;
    } else {
      this.currentDamageFrame % 2 == 0 ? this.x-=.1 : this.x+=.1;
      this.currentDamageFrame++;
    }
  }

  takeDamage(damage){
    if(this.takingDamage) return;
    this.currentDamageFrame = 0
    this.hitPoints -= damage;
    if (this.hitPoints <= 0){
      activeRoom.tileArray = activeRoom.tileArray.filter(tile => tile != this)
      level.chestsOpened += 1
      let random = Math.random();
      if(random >= .9){
        activeRoom.monsters.push(new Monster(this.x, this.y))
        activeRoom.monsters.push(new Monster(this.x, this.y))
      }
      if(random > .7){
        console.log("Stamina Pot spawn")
      } else {
        activeRoom.tileArray.push(new Potion(this.x, this.y, TS));
      }
    }
    this.takingDamage = true;
  }

  distanceToCoord(x1,y1){
    return ((x1-this.x*TS)**2 + (y1-this.y*TS)**2)**.5
  }

  inArea(x,y){
    if(this.obstructing && x>=this.x*TS+15 && x<this.x*TS+TS-15 &&  y>=this.y*TS+15 && y<this.y*TS+TS-10 ){
      return true;
    }else{
      return false;
    }
  }
}

export default Chest