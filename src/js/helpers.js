import { UP, DOWN, LEFT, RIGHT } from "./constants"
import Room from "./Room"
import Level from "./Level"
import Player from "./entities/Player"
import OverlayManager from "./OverlayManager"

function randomIntFromInterval(min,max){
  return Math.floor(Math.random()*(max-min+1)+min)
}

function distance(x1, y1, x2, y2){
  return Math.sqrt((x2-x1)**2 + (y2-y1)**2)
}

function getMousePosition(canvas, event) {
  let rect = canvas.getBoundingClientRect()
  let x = event.clientX - rect.left
  let y = event.clientY - rect.top
  console.log("Coordinate x: " + x, "Coordinate y: " + y)
  return { x: x, y: y }
}

function setGame(){
  global.activeRoom = new Room(0,0)
  global.player = new Player()
  global.level = new Level(1)
  global.overlayManager = new OverlayManager()

  level.buildOutRooms()
  player.setLocation(activeRoom.spawnLocation)

  overlayManager.addPrimaryOverlay()
  overlayManager.addControlsInfoOverlay()
  overlayManager.addLevelStartOverlay()
  if(localStorage.getItem("showDebug") === "1") overlayManager.addDebugInfoOverlay()
  if(activeRoom.torches.length === 0) overlayManager.addDarkRoomOverlay()
}

function handleInput() {

  if(input.isDown("UP")) {
    if(!player.isAttacking) {
      player.isAttacking = true
      player.facing = UP
    }
  }

  if(input.isDown("RIGHT")) {
    if(!player.isAttacking) {
      player.isAttacking = true
      player.facing = RIGHT
    }
  }

  if(input.isDown("DOWN")) {
    if(!player.isAttacking) {
      player.isAttacking = true
      player.facing = DOWN
    }
  }

  if(input.isDown("LEFT")) {
    if(!player.isAttacking) {
      player.isAttacking = true
      player.facing = LEFT
    }
  }
}

function point(x,y) {
  return { x: x, y: y }
}


export { setGame, randomIntFromInterval, handleInput, distance, point, getMousePosition }