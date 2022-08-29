import { TS } from '../constants'
import {distance} from '../helpers'
import BoundingRegion from './BoundingRegion'

class BoundingElliptic extends BoundingRegion{
  constructor(options) {
    super(options)

    this.xSemiAxis = options.xSemiAxis || TS
    this.ySemiAxis = options.ySemiAxis || TS
    this.majorSemiAxis = Math.max(this.xSemiAxis, this.ySemiAxis)
    this.boundaryType = "elliptic"
  }

  angleInRadiansToTargetPoint(x, y) {
    let dy = y - this.y;
    let dx = x - this.x;
    let theta = Math.atan2(dy, dx); // range (-PI, PI]
    return theta
  }

  minumumDistToTarget(x, y){
    let angleToTarget = this.angleInRadiansToTargetPoint(x, y)
    let radiusAtAngle = this.xSemiAxis*this.ySemiAxis / Math.sqrt((this.xSemiAxis**2) * (Math.sin(angleToTarget)**2) + (this.ySemiAxis**2) * (Math.cos(angleToTarget)**2))
    return radiusAtAngle
  }

  drawArea(fillColor, otherBoundaries = []){
    this.updateBoundaryCoords()

    ctx.save
    ctx.strokeStyle = fillColor;
    ctx.beginPath()
    ctx.ellipse(this.x, this.y, this.xSemiAxis, this.ySemiAxis, 0, 0, 2*Math.PI)
    ctx.stroke()

    ctx.fillStyle = fillColor;
    ctx.fillRect(this.x-2,this.y-2,5,5); // Creates visual reference for boundaries center mark

    /** 
    otherBoundaries.forEach(target => {
      if(target.boundary == this) return; // Dont try and check intersection for self
      let minumumDistToTarget = this.minumumDistToTarget(target.boundary.centerX(), target.boundary.centerY())
      let angle = this.angleInRadiansToTargetPoint(target.boundary.centerX(), target.boundary.centerY())
      let pointOnCircumference = {x: this.centerX()+minumumDistToTarget*Math.cos(angle), y: this.centerY()+minumumDistToTarget*Math.sin(angle)}

      ctx.beginPath();
      ctx.moveTo(this.centerX(), this.centerY());
      ctx.lineTo(pointOnCircumference.x, pointOnCircumference.y);
      ctx.stroke();
    })
    */

    ctx.restore
  }

  ellipticCollision(boundary, xAdjust, yAdjust){
    let totalDistanceBetween = distance(this.x+xAdjust, this.y+yAdjust, boundary.x, boundary.y)

    // Continues to next iteration if distance is larger than max possible distance of touching elliptics
    if(boundary.majorSemiAxis+this.majorSemiAxis <= totalDistanceBetween) return false

    let minDistanceFromThis = this.minumumDistToTarget(boundary.x, boundary.y)
    let minDistanceFromTarget = boundary.minumumDistToTarget(this.x, this.y)

    return minDistanceFromThis + minDistanceFromTarget > totalDistanceBetween
  }
}

export default BoundingElliptic