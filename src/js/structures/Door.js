import Structure from "./Structure"
import {UP, DOWN, LEFT, RIGHT} from "../constants"
import {randomIntFromInterval} from "../helpers"

// Tiles
import FloorTile from "../tiles/FloorTile";
import DoorTile from "../tiles/DoorTile";
import TestTile from "../tiles/TestTile"

class Door extends Structure{
    constructor(roomWidth, roomHeight, direction){
        super()
        let doorCoordinates = this.calculateDoorLocation(roomWidth, roomHeight, direction)
        this.x = doorCoordinates.x
        this.y = doorCoordinates.y
        this.direction = direction;
        this.build();
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
                this.selfArray.push(new DoorTile(imgs.floor2, 0, this.x, this.y, DOWN));
                this.floorSpaces = [[this.x, this.y], [this.x, this.y-1]]
                break;
            case UP:
                this.selfArray.push(new FloorTile(this.x, this.y+2));//Floor gap in wall
                this.selfArray.push(new DoorTile(imgs.floor2, 0, this.x, this.y+1, UP));
                this.floorSpaces = [[this.x, this.y+1], [this.x, this.y+2]]
                break;
            case LEFT:
                this.selfArray.push(new DoorTile(imgs.floor2, 0, this.x, this.y, LEFT ));
                this.floorSpaces = [[this.x, this.y]]
                break;
            case RIGHT:
                this.selfArray.push(new DoorTile(imgs.floor2, 0, this.x, this.y, RIGHT ));
                this.floorSpaces = [[this.x, this.y]]
                break;
        }
    }
}

export default Door