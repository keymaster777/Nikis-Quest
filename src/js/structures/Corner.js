import Structure from "./Structure";
import {UPLEFT, UPRIGHT, DOWNLEFT, DOWNRIGHT} from "../constants"
import WallTile2 from "../tiles/WallTile2";
import FloorTile from "../tiles/FloorTile";

class Corner extends Structure{

    constructor(x, y, direction){
        super(x,y);
        this.direction = direction;
        this.build();
    }

    build(){
        switch(this.direction){
            case UPLEFT:
                this.selfArray.push(new WallTile2(imgs.wallTopLeft, 2 , this.x, this.y, {obstructing:true}));
                this.selfArray.push(new WallTile2(imgs.wallMid, 1 , this.x, this.y+1, {obstructing:true}));
                this.selfArray.push(new WallTile2(imgs.wallSideMidRight, 1 , this.x, this.y+1, {obstructing:true}));
                break;
            case UPRIGHT:
                this.selfArray.push(new WallTile2(imgs.wallTopRight, 2 , this.x, this.y, {obstructing:true}));
                this.selfArray.push(new WallTile2(imgs.wallMid, 1 , this.x, this.y+1, {obstructing:true}));
                this.selfArray.push(new WallTile2(imgs.wallSideMidLeft, 1 , this.x, this.y+1, {obstructing:true}));
                break;
            case DOWNLEFT:
                this.selfArray.push(new WallTile2(imgs.wallLeft, 3 , this.x, this.y, {obstructing:true}));
                this.selfArray.push(new WallTile2(imgs.wallInnerCornerTopLeft, 3 , this.x, this.y-1, { obstructing:true, hitboxLeft:true}));
                this.selfArray.push(new FloorTile(this.x, this.y-1));
                break;
            case DOWNRIGHT:
                this.selfArray.push(new WallTile2(imgs.wallRight, 3 , this.x, this.y, {obstructing:true}));
                this.selfArray.push(new WallTile2(imgs.wallInnerCornerTopRight, 3 , this.x, this.y-1, {obstructing:true, hitboxRight:true}));
                this.selfArray.push(new FloorTile(this.x, this.y-1));
                break;
        }

        this.occupyingSpaces = this.selfArray.map(i => [i.x,i.y]);
    }
}

export default Corner