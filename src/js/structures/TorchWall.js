import Structure from "./Structure";
import {sprite} from "../helpers"
import FloorTile from "../tiles/FloorTile";
import WallTile from "../tiles/WallTile";
import {UP, LEFT, RIGHT, TS} from "../constants"

class TorchWall extends Structure{
    constructor(x, y, direction){
        super(x,y);
        this.direction = direction;
        this.sprite = sprite({
            width: 64,
            height: 16,
            image: imgs.torch,
            numberOfFrames: 4,
            sizescale: .065,
            defaultSize:true
        });
        this.build();
    }

    build(){
        switch(this.direction){
            case UP:
                this.sprite.image = imgs.torch;
                this.sprite.x = this.x*TS;
                this.sprite.y = (this.y+1)*TS;
                this.selfArray.push(new WallTile(imgs.wallMidTop, 3 , this.x, this.y, {}));
                this.selfArray.push(new WallTile(imgs.wallMid, 1 , this.x, this.y+1, {obstructing:true}));
                break;
            case LEFT:
                this.sprite.image = imgs.torchSideLeft;
                this.sprite.x = this.x*TS;
                this.sprite.y = this.y*TS;
                this.selfArray.push(new WallTile(imgs.wallSideMidRight, 3 , this.x, this.y, {obstructing:true, hitboxLeft:true}));
                this.selfArray.push(new FloorTile(this.x, this.y));
                break;
            case RIGHT:
                this.sprite.image = imgs.torchSideRight;
                this.sprite.x = this.x*TS;
                this.sprite.y = this.y*TS;
                this.selfArray.push(new WallTile(imgs.wallSideMidLeft, 3 , this.x, this.y, {obstructing:true, hitboxRight:true}));
                this.selfArray.push(new FloorTile(this.x, this.y));
                break;
        }
        this.occupyingSpaces = this.selfArray.map(i => [i.x,i.y]);
    }
}

export default TorchWall