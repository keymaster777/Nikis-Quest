
class Entity{
  constructor(x, y){
    this.x = x
    this.y = y

    this.canMove = false
  }

  setUpMovementBehavior(options){
    this.canMove = true
  }
}

export default Entity
