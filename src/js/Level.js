import Room from "./Room"
import Door from "./structures/Door"

//Images

class Level{
  constructor(levelNum) {
    this.levelNum = levelNum
    this.rooms = [activeRoom]
  }

  nextLevel(){
    activeRoom = new Room(0,0)
    activeRoom.visited = true
    this.rooms = [activeRoom]
    this.levelNum += 1
    level.buildOutRooms()
    player.setLocation(activeRoom.spawnLocation)
    overlayManager.addExitInstructionsOverlay()
  }

  getRoom(x,y){
    return this.rooms.find(room => room.x == x && room.y == y)
  }

  nextRoom(doorLeftFrom){
    level.allMonstersKilled = level.haveAllMonstersBeenKilled()

    activeRoom = doorLeftFrom.adjacentRoom
    activeRoom.entryDoor = activeRoom.doors.find(door => door.adjacentRoom == doorLeftFrom.room)

    this.updateMap()

    activeRoom.randomNum = Math.random() // Reset rooms random factor, currently just for message events

    player.setLocation(activeRoom.entryDoor.entranceCoords)
    if(activeRoom.torches.length == 0) overlayManager.addDarkRoomOverlay()
    if(activeRoom.monsters.find(monster => monster.potionsConsumed > 0)) overlayManager.addBossBarOverlay()
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
      let adjacentRoomCoords = [[room.x-1, room.y], [room.x+1, room.y], [room.x, room.y-1], [room.x, room.y+1]]
      let applicableRoomCoords = adjacentRoomCoords.filter(coords => level.getRoom(...coords) == undefined)
      
      applicableRoomCoords.forEach(coords => {
        if(Math.random() * room.distanceFromCenter() ** 2 < .5){
          let newRoom = this.addRoomToList(...coords)
          if(newRoom){
            room.doors.push(new Door(room, newRoom))
            newRoom.doors.push(new Door(newRoom, room))
          }
        }
      })

      room.buildRoom()
    })

    this.buildOutRooms()
  }

  addRoomToList(x, y) {
    if(this.getRoom(x,y) == undefined){
      let room = new Room(x, y)
      this.rooms.push(room)
      return room
    } else {
      return false
    }
  }

  haveAllMonstersBeenKilled(){
    let monsterCount = 0
    this.rooms.forEach(room => monsterCount += room.monsters.length)
    return monsterCount == 0 
  }

  isComplete(){
    return (activeRoom.x == 0 && activeRoom.y == 0 && this.haveAllMonstersBeenKilled())
  }
}

export default Level