import { TS } from "../constants"
import { point } from "../helpers"
import BoundingRegion from "./BoundingRegion"

class BoundingRectangle extends BoundingRegion{
  constructor(options) {
    super(options)

    this.width = options.width || TS
    this.height = options.height || TS

    // Rect boundaries that are static can be automatically merged together with adjacent ones of the same dimensions
    this.staticBoundary = options.staticBoundary || true
  }

  multiplySize(multiplier){
    this.width = this.width * multiplier
    this.height = this.height * multiplier
  }

  drawArea(fillColor){
    this.updateBoundaryCoords()
    ctx.strokeStyle = fillColor
    ctx.strokeRect(this.x, this.y, this.width, this.height)
  }

  angleInRadiansToTargetPoint(x, y) {
    let closestPoint = this.closestPointTo(x,y)
    let dy = y - closestPoint.y
    let dx = x - closestPoint.x
    let theta = Math.atan2(dy, dx) // range (-PI, PI]
    return theta
  }

  closestPointTo(x,y){
    let closestPoint = point(x,y)
    if(this.x > x) closestPoint.x = this.x
    if(this.x + this.width < x) closestPoint.x = this.x+this.width
    if(this.y > y) closestPoint.y = this.y
    if(this.y + this.height < y) closestPoint.y = this.y+this.height
    return closestPoint
  }

  containsPoint(point){
    let xOverlap = this.x <=  point.x && this.x + this.width >= point.x
    let yOverlap = this.y <= point.y && this.y + this.height >= point.y
    return xOverlap && yOverlap
  }
}

export default BoundingRectangle