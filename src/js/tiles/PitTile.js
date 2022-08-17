import Tile from "./Tile";
import {TS} from "../constants"

class PitTile extends Tile{
  constructor(x,y){
    super(imgs.edge, 0, x, y);
    this.obstructing = true;
  }

  draw(){
    let tileAbovePit = activeRoom.tileArray.find(tile => tile.x == this.x & tile.y == this.y-1)
    if (!(tileAbovePit instanceof PitTile)){
      ctx.drawImage(this.tileimg, this.x*TS, this.y*TS, TS,TS);
    }
  }

  inArea(x,y){
      return x>=this.x*TS+(TS*.25) && x<this.x*TS+(TS*.75) && y>=this.y*TS && y<this.y*TS+TS ? true : false;
  }
}

export default PitTile