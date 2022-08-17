import Structure from "./Structure"
import {UP, DOWN, LEFT, RIGHT} from "../constants"

// Tiles
import WallTile2 from "../tiles/WallTile2";
import FloorTile from "../tiles/FloorTile";
import DoorTile2 from "../tiles/DoorTile2";

class Door extends Structure{
    constructor(x, y, direction){
        super(x,y);

        this.direction = direction;
        this.enabled = false;
        this.build();
    }

    build(){
        switch(this.direction){
            case DOWN:
                this.selfArray.push(new WallTile2(imgs.wallArch, 3 , this.x, this.y-1, { obstructing: false }));//Archway
                this.selfArray.push(new FloorTile(this.x, this.y-1)); //Floor Tile doormat
                this.selfArray.push(new DoorTile2(imgs.floor2, 0, this.x, this.y, DOWN));
                break;
            case UP:
                this.selfArray.push(new WallTile2(imgs.wallArch, 3 , this.x, this.y, { obstructing: false }));//Archway
                this.selfArray.push(new FloorTile(this.x, this.y+2));//Floor Tile doormat
                this.selfArray.push(new DoorTile2(imgs.floor2, 0, this.x, this.y+1, UP));
                break;
            case LEFT:
                this.selfArray.push( new WallTile2(imgs.wallSideFrontRight, 2, this.x, this.y-1, { obstructing:true, hitboxLeft:true}));
                this.selfArray.push( new WallTile2(imgs.wallSideTopRight, 3, this.x, this.y, { obstructing: false}));
                this.selfArray.push( new FloorTile(this.x, this.y-1));
                this.selfArray.push( new FloorTile(this.x+1, this.y));//Floor Tile doormat
                this.selfArray.push(new DoorTile2(imgs.floor2, 0, this.x, this.y, LEFT ));
                break;
            case RIGHT:
                this.selfArray.push( new WallTile2(imgs.wallSideFrontLeft, 2, this.x, this.y-1, { hitboxRight:true, obstructing:true}));
                this.selfArray.push( new WallTile2(imgs.wallSideTopLeft, 3, this.x, this.y, { obstructing: false}));
                this.selfArray.push( new FloorTile(this.x, this.y-1));
                this.selfArray.push( new FloorTile(this.x-1, this.y));//Floor Tile doormat
                this.selfArray.push(new DoorTile2(imgs.floor2, 0, this.x, this.y, RIGHT ));
                break;
        }
        this.occupyingSpaces = this.selfArray.map(i => [i.x,i.y]);
    }
}

export default Door