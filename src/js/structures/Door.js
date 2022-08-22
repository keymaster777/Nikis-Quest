import Structure from "./Structure"
import {UP, DOWN, LEFT, RIGHT} from "../constants"
import {randomIntFromInterval} from "../helpers"

// Tiles
import WallTile from "../tiles/WallTile";
import FloorTile from "../tiles/FloorTile";
import DoorTile from "../tiles/DoorTile";

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
                this.selfArray.push(new WallTile(imgs.wallArch, 3 , this.x, this.y-1, { obstructing: false }));//Archway
                this.selfArray.push(new FloorTile(this.x, this.y-1)); //Floor Tile doormat
                this.selfArray.push(new DoorTile(imgs.floor2, 0, this.x, this.y, DOWN));
                break;
            case UP:
                this.selfArray.push(new WallTile(imgs.wallArch, 3 , this.x, this.y, { obstructing: false }));//Archway
                this.selfArray.push(new FloorTile(this.x, this.y+2));//Floor Tile doormat
                this.selfArray.push(new DoorTile(imgs.floor2, 0, this.x, this.y+1, UP));
                break;
            case LEFT:
                this.selfArray.push( new WallTile(imgs.wallSideFrontRight, 2, this.x, this.y-1, { obstructing:true, hitboxLeft:true}));
                this.selfArray.push( new WallTile(imgs.wallSideTopRight, 3, this.x, this.y, { obstructing: false}));
                this.selfArray.push( new FloorTile(this.x, this.y-1));
                this.selfArray.push( new FloorTile(this.x+1, this.y));//Floor Tile doormat
                this.selfArray.push(new DoorTile(imgs.floor2, 0, this.x, this.y, LEFT ));
                break;
            case RIGHT:
                this.selfArray.push( new WallTile(imgs.wallSideFrontLeft, 2, this.x, this.y-1, { hitboxRight:true, obstructing:true}));
                this.selfArray.push( new WallTile(imgs.wallSideTopLeft, 3, this.x, this.y, { obstructing: false}));
                this.selfArray.push( new FloorTile(this.x, this.y-1));
                this.selfArray.push( new FloorTile(this.x-1, this.y));//Floor Tile doormat
                this.selfArray.push(new DoorTile(imgs.floor2, 0, this.x, this.y, RIGHT ));
                break;
        }
        this.occupyingSpaces = this.selfArray.map(i => [i.x,i.y]);
    }
}

export default Door