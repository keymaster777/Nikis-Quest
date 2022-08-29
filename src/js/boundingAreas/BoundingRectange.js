import { TS } from '../constants'
import {distance} from '../helpers'
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

  drawArea(fillColor, otherBoundaries = []){
    this.updateBoundaryCoords()
    ctx.save
    ctx.strokeStyle = fillColor;
    ctx.fillStyle = fillColor;
    ctx.fillRect(this.targetPoint.x, this.targetPoint.y, 5, 5)
    ctx.strokeRect(this.x, this.y, this.width, this.height)
    ctx.restore
  }

  containsPoint(targetX, targetY){
    let xOverlap = this.x < targetX && this.x+this.width > targetX
    let yOverlap = this.y < targetY && this.y+this.height > targetY
    return xOverlap && yOverlap
  }

  getClosestPointOnRect(targetX, targetY){
    let closestPoint = {x: targetX, y: targetY}
    if(this.x > targetX) closestPoint.x = this.x
    if(this.x + this.width < targetX) closestPoint.x = this.x+this.width
    if(this.y > targetY) closestPoint.y = this.y
    if(this.y + this.height < targetY) closestPoint.y = this.y+this.height
    this.targetPoint = closestPoint
    return closestPoint
  }

  canMergeWith(targetBoundary) {
    console.log("test")
    console.log(this.x+this.width, this, targetBoundary)
    if(this.x+this.width == targetBoundary.x && this.height == targetBoundary.height) return true
    if(this.y+this.height == targetBoundary.height && this.width == targetBoundary.width) return true
    return true
  }
}

export default BoundingRectangle