import { distance } from "../helpers"

class BoundingRegion{
  constructor(options) {
    // If boundary moves use coords function to get parent objects x and y
    this.isMovingBoundary = options.isMovingBoundary || false
    this.coords = options.coords || (() => ({ x: 0, y: 0 }))
    this.coordsAreVolatile = options.coordsAreVolatile || false
    this.cancelsDash = options.cancelsDash || false
    this.canBeFallenInto = options.canBeFallenInto || false
    this.collisionReferencePoint = { x: 0, y: 0 }
    this.triggerEvent = options.triggerEvent || null
    this.x = options.coords().x
    this.y = options.coords().y
  }

  static pointCollisions(point, boundaries) {
    let collidingBoundaries = []
    boundaries.forEach( boundary => {
      boundary.updateBoundaryCoords()
      if(boundary.containsPoint(point)) collidingBoundaries.push(boundary)
    })

    return collidingBoundaries.length > 0
  }

  static dashCancelling(boundaries) {
    return boundaries.filter(bound => bound.cancelsDash === true)
  }

  static canBeFallenInto(boundaries = activeRoom.boundaries()) {
    return boundaries.filter(bound => bound.canBeFallenInto === true)
  }

  static canNotBeFallenInto(boundaries) {
    return boundaries.filter(bound => bound.canBeFallenInto !== true)
  }

  updateBoundaryCoords(){
    if(this.coordsAreVolatile) return
    let updatedCoords = this.coords()
    this.x = updatedCoords.x
    this.y = updatedCoords.y
  }

  collidesWith(boundary){
    return this.boundaryCollisions([boundary]).length === 1
  }

  boundaryCollisions(boundaries){
    this.updateBoundaryCoords()
    let collidingBoundaries = []

    boundaries.forEach( boundary => {
      if(boundary === this) return // Dont reference self boundary

      boundary.updateBoundaryCoords()

      let closestBoundPoint = boundary.closestPointTo(this.x,this.y)

      if(this.containsPoint(closestBoundPoint)){
        if(boundary.width !== undefined){
          boundary.collisionPoint = closestBoundPoint
        } else {
          boundary.collisionPoint = boundary.coords()
        }
        collidingBoundaries.push(boundary)
      }
    })

    return collidingBoundaries
  }


  drawBounds(boundaries){
    // TODO clean up this method
    let collidingBoundaries = []

    boundaries.forEach( boundary => {
      if(boundary === this) return // Dont reference self boundary
      boundary.updateBoundaryCoords()

      let closestBoundPoint = boundary.closestPointTo(this.x,this.y)

      ctx.fillStyle = "blue"
      ctx.fillRect(closestBoundPoint.x-2,closestBoundPoint.y-2,5,5) // Creates visual reference for boundaries center mark

      let selfClosest = this.closestPointTo(closestBoundPoint.x, closestBoundPoint.y)
      if( distance(closestBoundPoint.x, closestBoundPoint.y, selfClosest.x, selfClosest.y) < 50){
        ctx.fillRect(selfClosest.x-2, selfClosest.y-2,5,5)
      }

    })

    return collidingBoundaries
  }


}

export default BoundingRegion