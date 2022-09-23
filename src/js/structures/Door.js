import Structure from "./Structure"
import {UP, DOWN, LEFT, RIGHT, TS} from "../constants"
import {randomIntFromInterval} from "../helpers"

// Tiles
import FloorTile from "../tiles/FloorTile";
import DoorTile from "../tiles/DoorTile";

import BoundingRectangle from "../boundingAreas/BoundingRectange";

class Door extends Structure{
    constructor(roomWidth, roomHeight, direction){
        super()
        let doorCoordinates = this.calculateDoorLocation(roomWidth, roomHeight, direction)
        this.x = doorCoordinates.x
        this.y = doorCoordinates.y
        this.direction = direction;

        this.effectBox = new BoundingRectangle({
          coords: (()=> ({x: this.x*TS, y: this.y*TS})),
          width: TS,
          height: TS,
          triggerEvent: ((entity) => this.stepInDoor(entity, this.direction))
        })

        this.build();
    }

    stepInDoor(entity, direction){
      if(entity == player){
        player.isDashing = false
        level.nextRoom(direction)
      } 
    }

    calculateDoorLocation(roomWidth, roomHeight, direction) {
        if (direction == UP) return {x: randomIntFromInterval(1, roomWidth-2), y: 1}
        if (direction == DOWN) return {x: randomIntFromInterval(1, roomWidth-2), y: roomHeight}
        if (direction == LEFT) return {x: 0, y: randomIntFromInterval(3, roomHeight-2)}
        if (direction == RIGHT) return {x: roomWidth-1, y: randomIntFromInterval(3, roomHeight-2)}
        throw "Invalid cardinal direction given."
    }

    build(){
        switch(this.direction){
            case DOWN:
                this.selfArray.push(new FloorTile(this.x, this.y-1)); // Door mat
                this.selfArray.push(new DoorTile(imgs.floor2, 0, this.x, this.y, DOWN));
                this.floorSpaces = [[this.x, this.y], [this.x, this.y-1]]
                this.effectBox.height = .1*TS
                this.effectBox.coords = (()=> ({x: this.x*TS, y: this.y*TS+(.9*TS)}))
                break;
            case UP:
                this.selfArray.push(new FloorTile(this.x, this.y+1)); // Door Mat
                this.selfArray.push(new DoorTile(imgs.floor2, 0, this.x, this.y, UP));
                this.floorSpaces = [[this.x, this.y], [this.x, this.y+1]]
                this.effectBox.height = .1*TS
                break;
            case LEFT:
                this.selfArray.push(new DoorTile(imgs.floor2, 0, this.x, this.y, LEFT ));
                this.floorSpaces = [[this.x, this.y]]
                this.effectBox.width = .1*TS
                break;
            case RIGHT:
                this.selfArray.push(new DoorTile(imgs.floor2, 0, this.x, this.y, RIGHT ));
                this.floorSpaces = [[this.x, this.y]]
                this.effectBox.width = .1*TS
                this.effectBox.coords = (()=> ({x: this.x*TS+(.9*TS), y: this.y*TS}))
                break;
        }
    }
}

export default Door