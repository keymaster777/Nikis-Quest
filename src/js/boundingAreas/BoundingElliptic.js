import { TS } from '../constants'
import {distance, point} from '../helpers'
import BoundingRegion from './BoundingRegion'

class BoundingElliptic extends BoundingRegion{
  constructor(options) {
    super(options)

    this.xSemiAxis = options.xSemiAxis || TS
    this.ySemiAxis = options.ySemiAxis || TS
    this.majorSemiAxis = Math.max(this.xSemiAxis, this.ySemiAxis)
    this.boundaryType = "elliptic"
  }

  angleInRadiansToTargetPoint(x, y, xAdjust, yAdjust) {
    let dy = y-yAdjust - this.y;
    let dx = x-xAdjust - this.x;
    let theta = Math.atan2(dy, dx); // range (-PI, PI]
    return theta
  }

  radiusFromPoint(x, y){
    let angleToTarget = this.angleInRadiansToTargetPoint(x, y, 0, 0)
    let radius = this.xSemiAxis*this.ySemiAxis / Math.sqrt((this.xSemiAxis**2) * (Math.sin(angleToTarget)**2) + (this.ySemiAxis**2) * (Math.cos(angleToTarget)**2))
    return radius
  }

  drawArea(fillColor){
    this.updateBoundaryCoords()

    ctx.save
    ctx.strokeStyle = fillColor;
    ctx.beginPath()
    ctx.ellipse(this.x, this.y, this.xSemiAxis, this.ySemiAxis, 0, 0, 2*Math.PI)
    ctx.stroke()

    ctx.fillStyle = fillColor;
    ctx.fillRect(this.x-2,this.y-2,5,5); // Creates visual reference for boundaries center mark
    ctx.restore
  }

  closestPointTo(x,y){
    let radiusFromPoint = this.radiusFromPoint(x, y)
    if (radiusFromPoint < distance(this.x, this.y, x, y)){
      let angle = this.angleInRadiansToTargetPoint(x, y, 0, 0)
      return point(this.x+radiusFromPoint*Math.cos(angle), this.y+radiusFromPoint*Math.sin(angle))
    }
    return point(x,y)
  }

  containsPoint(point, xAdjust, yAdjust){
    let radiusFromPoint = this.radiusFromPoint(point.x, point.y)
    let actualDistToPoint = distance(this.x+xAdjust, this.y+yAdjust, point.x, point.y)
    return actualDistToPoint < radiusFromPoint
  }
}

export default BoundingElliptic