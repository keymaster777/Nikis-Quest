import { TS } from '../constants'
import {distance, point} from '../helpers'
import BoundingRegion from './BoundingRegion'

class BoundingRectangle extends BoundingRegion{
  constructor(options) {
    super(options)

    this.width = options.width || TS
    this.height = options.height || TS

    // Rect boundaries that are static can be automatically merged together with adjacent ones of the same dimensions
    this.staticBoundary = options.staticBoundary || true

    this.boundaryType = "rectangle"

    this.targetPoint = {x: 0, y: 0}
  }

  drawArea(fillColor){
    this.updateBoundaryCoords()
    ctx.save
    ctx.strokeStyle = fillColor;
    ctx.fillStyle = fillColor;
    ctx.strokeRect(this.x, this.y, this.width, this.height)
    ctx.restore
  }

  closestPointTo(x,y){
    let closestPoint = point(x,y) 
    if(this.x > x) closestPoint.x = this.x
    if(this.x + this.width < x) closestPoint.x = this.x+this.width
    if(this.y > y) closestPoint.y = this.y
    if(this.y + this.height < y) closestPoint.y = this.y+this.height
    // this.targetPoint = closestPoint
    return closestPoint
  }

  containsPoint(point, xAdjust, yAdjust){
    let xOverlap = this.x + xAdjust <=  point.x && this.x + this.width+xAdjust >= point.x
    let yOverlap = this.y + yAdjust <= point.y && this.y + this.height + yAdjust >= point.y 
    return xOverlap && yOverlap
  }
}

export default BoundingRectangle