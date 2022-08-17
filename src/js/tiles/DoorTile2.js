import Tile from "./Tile";

class DoorTile2 extends Tile{
  constructor(tileimg, layer, x, y, direction){
      super(tileimg, layer, x, y);
      this.direction = direction;
  }
}

export default DoorTile2