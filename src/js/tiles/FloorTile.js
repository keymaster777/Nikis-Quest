import Tile from "./Tile"

class FloorTile extends Tile{
    constructor(x, y){
      const randomFloor = () => {
        let random = Math.random();
        switch(true){
            case random < .05:
                return imgs.floor2;
                break;
            case random < .1:
                return imgs.floor3;
                break;
            case random < .15:
                return imgs.floor4;
                break;
            case random < .2:
                return imgs.floor5;
                break;
            case random < .225:
                return imgs.floor7;
                break;
            default:
                return imgs.floor1;
                break;
        }
      }

      super(randomFloor(), 0, x, y);
    }
}

export default FloorTile