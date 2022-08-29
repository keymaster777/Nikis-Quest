import { TS } from '../constants'
import {distance} from '../helpers'

class BoundingRegion{
  constructor(options) {
    // If boundary moves use coords function to get parent objects x and y
    this.isMovingBoundary = options.isMovingBoundary || false
    this.coords = options.coords || (() => ({x: 0, y: 0}))
    this.coordsAreVolatile = options.coordsAreVolatile || false
    this.collisionReferencePoint = {x: 0, y: 0}
    this.x = options.coords().x 
    this.y = options.coords().y
  }

  updateBoundaryCoords(){
    if(this.coordsAreVolatile) return;

    let updatedCoords = this.coords()
    this.x = updatedCoords.x
    this.y = updatedCoords.y
  }

  boundaryCollisions(boundaries, xAdjust=0, yAdjust=0){
    let collidingBoundaries = []
    this.updateBoundaryCoords()
    boundaries.forEach( boundary => {
      if(boundary == this) return; // Dont reference self boundary
      boundary.updateBoundaryCoords()

      if(boundary.boundaryType == 'elliptic' && this.boundaryType == 'elliptic'){
        this.collisionReferencePoint = {x: this.x, y: this.y}
        boundary.collisionReferencePoint = {x: boundary.x, y: boundary.y}
        if(this.ellipticCollision(boundary, xAdjust, yAdjust)) collidingBoundaries.push(boundary)
      }
      if(this.boundaryType == 'elliptic' && boundary.boundaryType == 'rectangle' ){

        this.collisionReferencePoint = {x: this.x, y: this.y}
        boundary.collisionReferencePoint = boundary.getClosestPointOnRect(this.x+xAdjust, this.y+yAdjust)

        // Check if entity tried to dash into center of boundary
        if (boundary.containsPoint(this.x+xAdjust, this.y+yAdjust)){
          collidingBoundaries.push(boundary)
          return; // Already found a collision with boundary, go on to next one
        }

        let rectReferencePoint = boundary.getClosestPointOnRect(this.x+xAdjust, this.y+yAdjust)
        let minDistanceFromThisToRef = this.minumumDistToTarget(rectReferencePoint.x, rectReferencePoint.y)
        let totalDistanceBetween = distance(this.x+xAdjust, this.y+yAdjust, rectReferencePoint.x, rectReferencePoint.y)

        if(minDistanceFromThisToRef > totalDistanceBetween) collidingBoundaries.push(boundary)
      }

      if(this.boundaryType == 'rectangle' && boundary.boundaryType == 'elliptic' ){
        this.collisionReferencePoint = this.getClosestPointOnRect(boundary.x+xAdjust, boundary.y+yAdjust)
        boundary.collisionReferencePoint = {x: this.x, y: this.y}
        // Check if entity tried to dash into center of boundary
        if (this.containsPoint(boundary.x+xAdjust, boundary.y+yAdjust)){
          collidingBoundaries.push(boundary)
          return; // Already found a collision with boundary, go on to next one
        }

        let rectReferencePoint = this.getClosestPointOnRect(boundary.x+xAdjust, boundary.y+yAdjust)
        let minDistanceFromThisToRef = boundary.minumumDistToTarget(rectReferencePoint.x, rectReferencePoint.y)
        let totalDistanceBetween = distance(boundary.x+xAdjust, boundary.y+yAdjust, rectReferencePoint.x, rectReferencePoint.y)

        if(minDistanceFromThisToRef > totalDistanceBetween) collidingBoundaries.push(boundary)
      }
    })

    return collidingBoundaries
  }
}

export default BoundingRegion