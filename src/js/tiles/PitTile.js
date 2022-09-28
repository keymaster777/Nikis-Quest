import Tile from "./Tile";
import {TS} from "../constants"

class PitTile extends Tile{
  constructor(x,y){
    super(imgs.edge, 0, x, y);
  }

  draw(){
    let tileAbovePit = activeRoom.tileArray.find(tile => tile.x == this.x & tile.y == this.y-1)
    if (!(tileAbovePit instanceof PitTile)){
      ctx.drawImage(this.img, this.x*TS, this.y*TS, TS,TS);
    }
  }
}

export default PitTile