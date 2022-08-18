import Room from "./Room"
import { oppositeDirection } from "./helpers"
import {UP, LEFT, DOWN, RIGHT} from './constants'

//Images

class Level{
  constructor(levelNum) {
    this.levelNum = levelNum
    this.rooms = [activeRoom]
    this.enemiesFelled = 0
    this.chestsOpened = 0
    this.potionsConsumed = 0
  }

  getRoom(x,y, createNewRoom = false){
    let enteredFrom = oppositeDirection( activeRoom.leftFrom )
    let requestedRoom = this.rooms.find(room => room.x == x && room.y == y)

    if (requestedRoom == undefined && createNewRoom) {
      requestedRoom = new Room(x,y, oppositeDirection(activeRoom.leftFrom), this.rooms)
      this.rooms.push(requestedRoom)
    }

    // Ensures entered from is correct in the event that the room has already been entered previously
    requestedRoom.enteredFrom = enteredFrom
    requestedRoom.randomNum = Math.random() // Reset rooms random factor, currently just for message events

    return requestedRoom
  }

  nextRoom(){
    activeRoom.leftFrom = activeRoom.doorTiles.find(tile => tile.inArea(player.x, player.y)).direction
    let x = activeRoom.x
    let y = activeRoom.y

    switch(activeRoom.leftFrom){
      case UP:
        activeRoom = this.getRoom(x, y+1, true)
        break;
      case DOWN:
        activeRoom = this.getRoom(x, y-1, true)
        break;
      case LEFT:
        activeRoom = this.getRoom(x-1, y, true)
        break;
      case RIGHT:
        activeRoom = this.getRoom(x+1, y, true)
        break;
    }
    let roomEntranceCoords = activeRoom.entranceCoords()
    player.setLocation(roomEntranceCoords.x, roomEntranceCoords.y)
  }
}

export default Level