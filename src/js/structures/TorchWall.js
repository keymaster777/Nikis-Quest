import Structure from "./Structure";
import {sprite} from "../helpers"
import FloorTile from "../tiles/FloorTile";
import WallTile2 from "../tiles/WallTile2";
import {UP, LEFT, RIGHT, TS} from "../constants"

class TorchWall extends Structure{
    constructor(x, y, direction){
        super(x,y);
        this.torchImage = new Image();
        this.direction = direction;
        this.sprite = sprite({
            width: 64,
            height: 16,
            image: this.torchImage,
            numberOfFrames: 4,
            sizescale: .065,
            defaultSize:true
        });
        this.build();
    }

    build(){
        switch(this.direction){
            case UP:
                this.torchImage = imgs.torch;
                this.sprite.x = this.x*TS;
                this.sprite.y = (this.y+1)*TS;
                this.selfArray.push(new WallTile2(imgs.wallMidTop, 3 , this.x, this.y, {}));
                this.selfArray.push(new WallTile2(imgs.wallMid, 1 , this.x, this.y+1, {obstructing:true}));
                break;
            case LEFT:
                this.torchImage = imgs.torchSideLeft;
                this.sprite.x = this.x*TS;
                this.sprite.y = this.y*TS;
                this.selfArray.push(new WallTile2(imgs.wallSideMidRight, 3 , this.x, this.y, {obstructing:true, hitboxLeft:true}));
                this.selfArray.push(new FloorTile(this.x, this.y));
                break;
            case RIGHT:
                this.torchImage = imgs.torchSideRight;
                this.sprite.x = this.x*TS;
                this.sprite.y = this.y*TS;
                this.selfArray.push(new WallTile2(imgs.wallSideMidLeft, 3 , this.x, this.y, {obstructing:true, hitboxRight:true}));
                this.selfArray.push(new FloorTile(this.x, this.y));
                break;
        }
        this.occupyingSpaces = this.selfArray.map(i => [i.x,i.y]);
    }
}

export default TorchWall