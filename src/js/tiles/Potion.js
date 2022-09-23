import Tile from "./Tile";
import {TS} from "../constants";

class Potion extends Tile{
  constructor(x, y){
    super(imgs.potion, "*", x, y);
    this.obstructing = false;
    this.depthBreakpoint = this.y*TS+40
  }

  inArea(x,y){
    if( x>=this.x*TS+10 && x<this.x*TS+TS-10 &&  y>=this.y*TS+20 && y<this.y*TS+TS-10 ){
      return true;
    }else{
      return false;
    }
  }
}

export default Potion