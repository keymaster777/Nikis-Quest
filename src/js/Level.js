import Room from "./Room"
import Door from "./structures/Door"
import { oppositeDirection } from "./helpers"
import {UP, LEFT, DOWN, RIGHT} from './constants'
import {sprite} from "./helpers"

//Images

class Level{
  constructor(levelNum) {
    this.levelNum = levelNum
    this.rooms = [activeRoom]
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

  getRoom(x,y){
    return this.rooms.find(room => room.x == x && room.y == y)
  }

  nextRoom(){
    level.allMonstersKilled = level.haveAllMonstersBeenKilled()
    activeRoom.leftFrom = activeRoom.doorTiles.find(tile => tile.inArea(player.x, player.y)).direction
    let enteredFrom = oppositeDirection( activeRoom.leftFrom )
    let x = activeRoom.x
    let y = activeRoom.y

    switch(activeRoom.leftFrom){
      case UP:
        activeRoom = this.getRoom(x, y-1)
        break;
      case DOWN:
        activeRoom = this.getRoom(x, y+1)
        break;
      case LEFT:
        activeRoom = this.getRoom(x-1, y)
        break;
      case RIGHT:
        activeRoom = this.getRoom(x+1, y)
        break;
    }

    this.updateMap()
    // Ensures entered from is correct in the event that the room has already been entered previously
    activeRoom.enteredFrom = enteredFrom
    activeRoom.randomNum = Math.random() // Reset rooms random factor, currently just for message events
    let roomEntranceCoords = activeRoom.entranceCoords()

    player.setLocation(roomEntranceCoords.x, roomEntranceCoords.y)
  }

  updateMap(){
    activeRoom.visited = true;
    let adjacentRooms = this.rooms.filter(room => room.adjacentAccessToRoom(activeRoom))
    adjacentRooms.forEach(room => room.seen = true)
  }

  buildOutRooms(){
    let roomsToBeProcessed = this.rooms.filter(room => room.built == false)
    if (roomsToBeProcessed.length == 0) {
      this.updateMap()
      return null
    }
    roomsToBeProcessed.forEach(room => {
      let disabledDoors = this.mandatoryDisabledDoorsInRoom(room.x, room.y)
      let enabledDoors = this.mandatoryEnabledDoorsInRoom(room.x, room.y)
      let cardinalDirections =  [UP, LEFT, DOWN, RIGHT]
      
      cardinalDirections.forEach(doorDirection => {
        let random = Math.random() * room.distanceFromCenter() ** 2;

        if(!disabledDoors.includes(doorDirection) && !enabledDoors.includes(doorDirection) && random < .6){
          enabledDoors.push(doorDirection) 
        }
      })

      enabledDoors.forEach(doorDirection => {
        room.doors.push(new Door(room.width, room.height, doorDirection))
        if(doorDirection == LEFT) this.addRoomToList(room.x-1, room.y)
        if(doorDirection == RIGHT) this.addRoomToList(room.x+1, room.y)
        if(doorDirection == UP) this.addRoomToList(room.x, room.y-1)
        if(doorDirection == DOWN) this.addRoomToList(room.x, room.y+1)
      })

      room.buildRoom()
    })

    this.buildOutRooms()
  }

  addRoomToList(x, y) {
    if(this.getRoom(x,y) == undefined) this.rooms.push(new Room(x, y))
  }

  mandatoryDisabledDoorsInRoom(roomX, roomY){
    let result = []
    if(this.getRoom(roomX-1, roomY)?.hasDoor(RIGHT) == false) result.push(LEFT)
    if(this.getRoom(roomX+1, roomY)?.hasDoor(LEFT) == false) result.push(RIGHT)
    if(this.getRoom(roomX, roomY-1)?.hasDoor(DOWN) == false) result.push(UP)
    if(this.getRoom(roomX, roomY+1)?.hasDoor(UP) == false) result.push(DOWN)
    return result
  }

  mandatoryEnabledDoorsInRoom(roomX, roomY){
    let result = []
    if(this.getRoom(roomX-1, roomY)?.hasDoor(RIGHT) == true) result.push(LEFT)
    if(this.getRoom(roomX+1, roomY)?.hasDoor(LEFT) == true) result.push(RIGHT)
    if(this.getRoom(roomX, roomY-1)?.hasDoor(DOWN) == true) result.push(UP)
    if(this.getRoom(roomX, roomY+1)?.hasDoor(UP) == true) result.push(DOWN)
    return result
  }

  haveAllMonstersBeenKilled(){
    let monsterCount = 0
    this.rooms.forEach(room => monsterCount += room.monsters.length)
    return monsterCount == 0 
  }

  drawCompletionCriteria(x,y){
    ctx.fillStyle = "#b8b5b9"
    ctx.font = "16px Arial";

    ctx.fillText("LEVEL COMPLETION: ", x, y);

    ctx.drawImage(this.haveAllMonstersBeenKilled() ? imgs.checkboxCheck : imgs.checkbox, x, y+5, 40, 40);
    ctx.fillText("Clear all rooms", x+35, y+31);

    ctx.drawImage(this.isComplete() ? imgs.checkboxCheck : imgs.checkbox, x, y+35, 40, 40);
    ctx.fillText("Return to start" , x+35, y+61);
  }

  isComplete(){
    return (activeRoom.x == 0 && activeRoom.y == 0 && this.haveAllMonstersBeenKilled())
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
        if(room && (room.visited || room.seen)){
          ctx.fillStyle = "#785c53"
          ctx.fillRect(xi*34+7+x, yi*34+7+y, 30, 30);

          ctx.fillStyle = "#f7f2ed"
          ctx.fillRect(xi*34+10+x, yi*34+10+y, 24, 24);

          room.doors.forEach(door => {
            switch(door.direction){
              case UP:
                if(this.getRoom(room.x, room.y-1)?.visited){
                  ctx.fillRect(xi*34+19+x, yi*34+3+y, 6, 7);
                } else {
                  ctx.fillRect(xi*34+19+x, yi*34+7+y, 6, 3);
                }
                break;
              case DOWN:
                if(this.getRoom(room.x, room.y+1)?.visited){
                  ctx.fillRect(xi*34+19+x, yi*34+34+y, 6, 7);
                } else {
                  ctx.fillRect(xi*34+19+x, yi*34+34+y, 6, 3);
                }
                break;
              case LEFT:
                if(this.getRoom(room.x-1, room.y)?.visited){
                  ctx.fillRect(xi*34+3+x, yi*34+19+y, 7, 6);
                } else {
                  ctx.fillRect(xi*34+7+x, yi*34+19+y, 3, 6);
                }
                break;
              case RIGHT:
                if(this.getRoom(room.x+1, room.y)?.visited){
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