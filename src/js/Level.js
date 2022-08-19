import Room from "./Room"
import { oppositeDirection } from "./helpers"
import {UP, LEFT, DOWN, RIGHT} from './constants'
import {sprite} from "./helpers"

//Images

class Level{
  constructor(levelNum) {
    this.levelNum = levelNum
    this.rooms = [activeRoom]
    this.allRoomsDiscovered = false
    this.allMonstersKilled = false
    this.mapPlayerSprite = sprite({
      width: 256,
      height: 32,
      image: imgs.runDown,
      numberOfFrames: 8,
      sizescale: .02,
    })
    this.mapMonsterSprite = sprite({
        width: 64,
        height: 21,
        image: imgs.gnollShamanWalkRight,
        numberOfFrames: 4,
        sizescale: .025,
    });
  }

  getRoom(x,y, createNewRoom = false){
    let requestedRoom = this.rooms.find(room => room.x == x && room.y == y)

    if (requestedRoom == undefined && createNewRoom) {
      requestedRoom = new Room(x,y, oppositeDirection(activeRoom.leftFrom), this.rooms)
      this.rooms.push(requestedRoom)
      player.roomsExplored += 1
    }

    return requestedRoom
  }

  nextRoom(){
    activeRoom.leftFrom = activeRoom.doorTiles.find(tile => tile.inArea(player.x, player.y)).direction
    let enteredFrom = oppositeDirection( activeRoom.leftFrom )
    let x = activeRoom.x
    let y = activeRoom.y

    switch(activeRoom.leftFrom){
      case UP:
        activeRoom = this.getRoom(x, y-1, true)
        break;
      case DOWN:
        activeRoom = this.getRoom(x, y+1, true)
        break;
      case LEFT:
        activeRoom = this.getRoom(x-1, y, true)
        break;
      case RIGHT:
        activeRoom = this.getRoom(x+1, y, true)
        break;
    }

    // Ensures entered from is correct in the event that the room has already been entered previously
    activeRoom.enteredFrom = enteredFrom
    activeRoom.randomNum = Math.random() // Reset rooms random factor, currently just for message events
    let roomEntranceCoords = activeRoom.entranceCoords()

    player.setLocation(roomEntranceCoords.x, roomEntranceCoords.y)
    this.allRoomsDiscovered = this.haveAllRoomsBeenDiscovered()
  }

  haveAllRoomsBeenDiscovered(){
    let undiscoveredRooms = 0
    this.rooms.forEach(room => {
      room.doors.filter(door => door.enabled).forEach(door => {
        switch(door.direction){
          case UP:
            if(this.getRoom(room.x, room.y-1) == undefined) undiscoveredRooms += 1
            break
          case DOWN:
            if(this.getRoom(room.x, room.y+1) == undefined) undiscoveredRooms += 1 
            break
          case LEFT:
            if(this.getRoom(room.x-1, room.y) == undefined) undiscoveredRooms += 1
            break
          case RIGHT:
            if(this.getRoom(room.x+1, room.y) == undefined) undiscoveredRooms += 1
            break
        }        
      })
    })
    return undiscoveredRooms == 0
  }

  haveAllMonstersBeenKilled(){
    if(this.allRoomsDiscovered == false) return false
    let monsterCount = 0
    this.rooms.forEach(room => monsterCount += room.monsters.length)
    return monsterCount == 0 
  }

  drawCompletionCriteria(x,y){
    ctx.fillStyle = "#b8b5b9"
    ctx.font = "16px Arial";

    ctx.fillText("LEVEL COMPLETION: ", x, y);

    ctx.drawImage(this.allRoomsDiscovered ? imgs.checkboxCheck : imgs.checkbox, x, y+5, 40, 40);
    ctx.fillText("Explore all rooms", x+35, y+31);

    ctx.drawImage(this.allMonstersKilled ? imgs.checkboxCheck : imgs.checkbox, x, y+35, 40, 40);
    ctx.fillText("Kill all monsters" , x+35, y+61);

    ctx.drawImage((activeRoom.x==0 && activeRoom.y==0 && this.allMonstersKilled) ? imgs.checkboxCheck : imgs.checkbox, x, y+65, 40, 40);
    ctx.fillText("Return to start", x+35, y+91);
  }

  isComplete(){
    return (activeRoom.x == 0 && activeRoom.y == 0 && this.allMonstersKilled)
  }

  nextLevel(){
    this.levelNum += 1
    activeRoom = new Room(0,0)
    this.rooms = [activeRoom]
    player.setLocation(activeRoom.spawnLocation.x, activeRoom.spawnLocation.y)
  }

  drawMap(x,y){
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(x, y, 180, 180);
    this.mapMonsterSprite.update()


    let mapFirstX = activeRoom.x-2
    let mapFirstY = activeRoom.y-2

    for(let xi = 0; xi < 5; xi++){
      for(let yi = 0; yi < 5; yi++){
        let room = this.rooms.find(room => room.x == mapFirstX + xi && room.y == mapFirstY + yi)
        if(room){
          ctx.fillStyle = "#785c53"
          ctx.fillRect(xi*34+7+x, yi*34+7+y, 30, 30);

          ctx.fillStyle = "#f7f2ed"
          ctx.fillRect(xi*34+10+x, yi*34+10+y, 24, 24);

          room.doors.filter(door => door.enabled).forEach(door => {
            switch(door.direction){
              case UP:
                if(this.getRoom(room.x, room.y-1)){
                  ctx.fillRect(xi*34+19+x, yi*34+3+y, 6, 7);
                } else {
                  ctx.fillRect(xi*34+19+x, yi*34+7+y, 6, 3);
                }
                break;
              case DOWN:
                if(this.getRoom(room.x, room.y+1)){
                  ctx.fillRect(xi*34+19+x, yi*34+34+y, 6, 7);
                } else {
                  ctx.fillRect(xi*34+19+x, yi*34+34+y, 6, 3);
                }
                break;
              case LEFT:
                if(this.getRoom(room.x-1, room.y)){
                  ctx.fillRect(xi*34+3+x, yi*34+19+y, 7, 6);
                } else {
                  ctx.fillRect(xi*34+7+x, yi*34+19+y, 3, 6);
                }
                break;
              case RIGHT:
                if(this.getRoom(room.x+1, room.y)){
                  ctx.fillRect(xi*34+34+x, yi*34+19+y, 7, 6);
                } else {
                  ctx.fillRect(xi*34+34+x, yi*34+19+y, 3, 6);
                }
                break;
            }        
          })

          if(room.x == 0 && room.y == 0) {
            ctx.fillStyle = "#785c53"
            ctx.fillRect(xi*34+19+x, yi*34+19+y, 6, 6);
          }
          if(room == activeRoom) {
            this.mapPlayerSprite.x = xi*34+x+3
            this.mapPlayerSprite.y = yi*34+y-2
            this.mapPlayerSprite.draw()
          }
          if (room != activeRoom && room.monsters.length > 0) {
            this.mapMonsterSprite.x = xi*34+x+7
            this.mapMonsterSprite.y = yi*34+y+3
            this.mapMonsterSprite.render()
          }
        }
      }
    }
  }
}

export default Level