import Structure from "./Structure"
import Tile from "../tiles/Tile"
import FloorTile from "../tiles/FloorTile"
import BoundingElliptic from "../boundingAreas/BoundingElliptic"
import { TS } from "../constants"
import Torch from "../entities/Torch"

class FloorColumn extends Structure{
  constructor(x, y){
    super()
    this.x = x
    this.y = y

    this.boundaries = []
    this.buildTiles()
  }

  buildTiles() {
    this.boundaries.push(new BoundingElliptic({
      coords: (() => ({ x: this.x*TS+TS*.5, y: this.y*TS })),
      xSemiAxis: .4*TS,
      ySemiAxis: .2*TS,
      cancelsDash: true,
    }))

    this.selfArray.push(new FloorTile(this.x, this.y-1))
    this.selfArray.push(new FloorTile(this.x, this.y))

    this.selfArray.push(new Tile(imgs.columnBase, "*", this.x, this.y, { depthBreakpoint: this.y*TS }))
    this.selfArray.push(new Tile(imgs.columnMid, "*", this.x, this.y-1,{ depthBreakpoint: this.y*TS }))
    this.selfArray.push(new Tile(imgs.columnTop, "*", this.x, this.y-2,{ depthBreakpoint: this.y*TS }))

    this.occupyingSpaces = [[this.x,this.y],[this.x,this.y-1]]
  }

  addTorch() {
    this.torch = new Torch(this.x, this.y, { yAdjust: -TS, depthAdjust: TS })
  }
}

export default FloorColumn