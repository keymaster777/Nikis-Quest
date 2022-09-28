import Structure from "./Structure"
import {UP, DOWN, LEFT, RIGHT, TS} from "../constants"
import {randomIntFromInterval} from "../helpers"

// Tiles
import FloorTile from "../tiles/FloorTile";

import BoundingRectangle from "../boundingAreas/BoundingRectange";

class Door extends Structure{
    constructor(room, adjacentRoom){
      super()
      this.calculateDoorLocation(room, adjacentRoom)

      this.room = room
      this.adjacentRoom = adjacentRoom

      this.entranceCoords = {x: this.x*TS+.5*TS, y: this.y*TS+.5*TS}

      this.effectBox = new BoundingRectangle({
        coords: (()=> ({x: this.x*TS, y: this.y*TS})),
        width: TS,
        height: TS,
        triggerEvent: ((entity) => this.stepInDoor(entity, this))
      })

      this.build();
    }

    stepInDoor(entity, door){
      if(entity == player){
        player.isDashing = false
        level.nextRoom(door)
      } 
    }

    calculateDoorLocation(room, adjacentRoom) {
      if (room.y == adjacentRoom.y+1){
        this.x = randomIntFromInterval(1, room.width-2)
        this.y = 1
        this.direction = UP
      }
      if (room.y == adjacentRoom.y-1){
        this.x = randomIntFromInterval(1, room.width-2)
        this.y = room.height
        this.direction = DOWN
      }
      if (room.x == adjacentRoom.x+1){
        this.x = 0
        this.y = randomIntFromInterval(3, room.height-2)
        this.direction = LEFT
      }
      if (room.x == adjacentRoom.x-1){
        this.x = room.width-1
        this.y = randomIntFromInterval(3, room.height-2)
        this.direction = RIGHT
      } 
    }

    build(){
      this.selfArray.push(new FloorTile(this.x, this.y));
      this.occupyingSpaces = [[this.x,this.y]];

      if([UP, DOWN].includes(this.direction)) this.effectBox.height = .1*TS
      if([LEFT, RIGHT].includes(this.direction)) this.effectBox.width = .1*TS

      if(this.direction == DOWN) this.effectBox.coords = (()=> ({x: this.x*TS, y: this.y*TS+(.9*TS)}))
      if(this.direction == RIGHT) this.effectBox.coords = (()=> ({x: this.x*TS+(.9*TS), y: this.y*TS}))
    }
}

export default Door