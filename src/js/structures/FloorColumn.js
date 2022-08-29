import Structure from "./Structure";
import TestTile from "../tiles/TestTile";
import FloorTile from "../tiles/FloorTile";
import BoundingElliptic from "../boundingAreas/BoundingElliptic";
import { TS } from "../constants"

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
      coords: (() => ({x: this.x*TS+TS*.5, y: this.y*TS})),
      xSemiAxis: .4*TS,
      ySemiAxis: .2*TS,
    }))

    this.selfArray.push(new FloorTile(this.x, this.y-1));
    this.selfArray.push(new FloorTile(this.x, this.y));

    this.selfArray.push(new TestTile(imgs.columnBase, 2, this.x, this.y))
    this.selfArray.push(new TestTile(imgs.columnMid, '*', this.x, this.y-1,{depthBreakpoint: this.y*TS}))
    this.selfArray.push(new TestTile(imgs.columnTop, 3, this.x, this.y-2))

    this.occupyingSpaces = [[this.x,this.y],[this.x,this.y-1]];
  }
}

export default FloorColumn