import Structure from "./Structure"
import {UP, DOWN, LEFT, RIGHT} from "../constants"
import {randomIntFromInterval} from "../helpers"
import BoundingRectangle from "../boundingAreas/BoundingRectange";

// Tiles
import FloorTile from "../tiles/FloorTile";

class DoorNew extends Structure{
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
          triggerEvent: this.stepInDoor
        })

        this.build();
    }

    stepInDoor(entity){
      console.log(entity)
      if(entity == level.player)
    }

    calculateDoorLocation(roomWidth, roomHeight, direction) {
        if (direction == UP) return {x: randomIntFromInterval(1, roomWidth-2), y: 0}
        if (direction == DOWN) return {x: randomIntFromInterval(1, roomWidth-2), y: roomHeight}
        if (direction == LEFT) return {x: 0, y: randomIntFromInterval(3, roomHeight-2)}
        if (direction == RIGHT) return {x: roomWidth-1, y: randomIntFromInterval(3, roomHeight-2)}
        throw "Invalid cardinal direction given."
    }

    build(){
        switch(this.direction){
            case DOWN:
                this.selfArray.push(new FloorTile(this.x, this.y-1)); //Floor gap in wall
                this.selfArray.push(new FloorTile( this.x, this.y));
                this.floorSpaces = [[this.x, this.y], [this.x, this.y-1]]
                this.effectBox.height = .1*TS
                this.effectBox.coords = (()=> ({x: this.x*TS, y: this.y*TS+(.9*TS)}))
                break;
            case UP:
                this.selfArray.push(new FloorTile(this.x, this.y+2));//Floor gap in wall
                this.selfArray.push(new FloorTile(this.x, this.y+1));
                this.floorSpaces = [[this.x, this.y+1], [this.x, this.y+2]]
                break;
            case LEFT:
                this.selfArray.push(new FloorTile(this.x, this.y));
                this.floorSpaces = [[this.x, this.y]]
                break;
            case RIGHT:
                this.selfArray.push(new FloorTile(this.x, this.y));
                this.floorSpaces = [[this.x, this.y]]
                break;
        }
    }
}

export default DoorNew