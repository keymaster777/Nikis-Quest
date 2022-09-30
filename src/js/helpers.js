import { UP, DOWN, LEFT, RIGHT } from "./constants"

function randomIntFromInterval(min,max){
  return Math.floor(Math.random()*(max-min+1)+min)
}

function distance(x1, y1, x2, y2){
  return Math.sqrt((x2-x1)**2 + (y2-y1)**2)
}

function handleInput() {

  if(input.isDown("UP")) {
    if(!player.isAttacking) {
      player.isAttacking = true
      player.attackDirection = UP
    }
  }

  if(input.isDown("RIGHT")) {
    if(!player.isAttacking) {
      player.isAttacking = true
      player.attackDirection = RIGHT
    }
  }

  if(input.isDown("DOWN")) {
    if(!player.isAttacking) {
      player.isAttacking = true
      player.attackDirection = DOWN
    }
  }

  if(input.isDown("LEFT")) {
    if(!player.isAttacking) {
      player.isAttacking = true
      player.attackDirection = LEFT
    }
  }
}

function point(x,y) {
  return { x: x, y: y }
}


export { randomIntFromInterval, handleInput, distance, point }