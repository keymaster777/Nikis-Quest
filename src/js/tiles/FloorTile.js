import Tile from "./Tile"
import { TS } from "../constants"

class FloorTile extends Tile{
  constructor(x, y){
    const randomFloor = () => {
      let random = Math.random()
      switch(true){
      case random < .05:
        return imgs.floor2
      case random < .1:
        return imgs.floor3
      case random < .15:
        return imgs.floor4
      case random < .2:
        return imgs.floor5
      case random < .225:
        return imgs.floor7
      default:
        return imgs.floor1
      }
    }


    super(randomFloor(), "*", x, y, { depthBreakpoint: y*TS-TS })

  }
}

export default FloorTile