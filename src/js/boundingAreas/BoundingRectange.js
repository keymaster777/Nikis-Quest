import { TS, LEFT, RIGHT, UP, DOWN } from "../constants"
import { point } from "../helpers"
import BoundingRegion from "./BoundingRegion"

class BoundingRectangle extends BoundingRegion{
  constructor(options) {
    super(options)

    this.width = options.width || TS
    this.height = options.height || TS

    // Rect boundaries that are static can be automatically merged together with adjacent ones of the same dimensions
    this.staticBoundary = options.staticBoundary || true
    this.type = "rect"
  }

  get centerPoint(){ return { x: this.x+this.width/2, y: this.y+this.height/2 }}

  multiplySize(multiplier){
    this.width = this.width * multiplier
    this.height = this.height * multiplier
  }

  drawArea(fillColor){
    this.updateBoundaryCoords()
    ctx.strokeStyle = fillColor
    ctx.strokeRect(this.x, this.y, this.width, this.height)

    ctx.fillStyle = fillColor
    ctx.fillRect(this.x-2,this.y-2,5,5)
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
    if(this.x >= x) closestPoint.x = this.x
    if(this.x + this.width <= x) closestPoint.x = this.x+this.width
    if(this.y > y) closestPoint.y = this.y
    if(this.y + this.height < y) closestPoint.y = this.y+this.height
    return closestPoint
  }

  collisionAngleToBound(boundary) {
    let angleReferencePoint, selfReferencePoint
    if( boundary instanceof BoundingRectangle){
      angleReferencePoint = this.closestPointToBound(boundary)
      let directions = [
        { angle: Math.PI, distance: (angleReferencePoint.x - this.x)/this.width },
        { angle: 0, distance: (this.x+this.width - angleReferencePoint.x)/this.width },
        { angle: -Math.PI/2, distance: (angleReferencePoint.y - this.y)/this.height },
        { angle: Math.PI/2, distance: (this.y+this.height - angleReferencePoint.y)/this.height },
      ]
      directions = directions.sort((a, b) => (a.distance > b.distance) ? 1 : -1)
      return directions[0].angle
    } else {
      angleReferencePoint = boundary.coords()
      selfReferencePoint = this.closestPointToBound(boundary)
    }

    let dy = angleReferencePoint.y - selfReferencePoint.y
    let dx = angleReferencePoint.x - selfReferencePoint.x
    let theta = Math.atan2(dy, dx) // range (-PI, PI]
    return theta
  }

  closestPointToPoint(x,y){
    let closestPoint = point(x,y)
    if(this.x >= x) closestPoint.x = this.x
    if(this.x + this.width <= x) closestPoint.x = this.x+this.width
    if(this.y > y) closestPoint.y = this.y
    if(this.y + this.height < y) closestPoint.y = this.y+this.height
    return closestPoint
  }

  closestPointToBound(boundary){
    if(boundary instanceof BoundingRectangle){
      let otherBoundClosest = boundary.closestPointToPoint(this.x+this.width/2, this.y+this.height/2)
      return this.closestPointToPoint(otherBoundClosest.x, otherBoundClosest.y)
    } else {
      return this.closestPointToPoint(boundary.x, boundary.y)
    }
  }


  containsPoint(point){
    let xOverlap = this.x <=  point.x && this.x + this.width >= point.x
    let yOverlap = this.y <= point.y && this.y + this.height >= point.y
    return xOverlap && yOverlap
  }

  probePoints(){
    let probePoints = {}

    probePoints[LEFT] = { x: this.x, y: this.y+(.5*this.height) }
    probePoints[RIGHT] = { x: this.x+this.width, y: this.y+(.5*this.height) }
    probePoints[UP] = { x: this.x+(.5*this.width), y: this.y }
    probePoints[DOWN] = { x: this.x+(.5*this.width), y: this.y+this.height }

    return probePoints
  }
}

export default BoundingRectangle