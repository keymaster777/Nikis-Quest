import Structure from "./Structure";
import FloorTile from "../tiles/FloorTile";
import WallTile from "../tiles/WallTile";
import { UP, DOWN } from "../constants"


class WallColumn extends Structure{
    constructor(x, y, direction){
        super(x,y);
        this.direction = direction;
        this.build();
    }

    build(){
        switch (this.direction){
            case UP:
                this.selfArray.push(new WallTile(imgs.wallColumnTop, 3, this.x, this.y, {obstructing:true}));
                this.selfArray.push(new WallTile(imgs.wallColumnMid, 2, this.x, this.y+1, {obstructing:true}));
                this.selfArray.push(new WallTile(imgs.wallColumnBase, 0, this.x, this.y+2, {obstructing:true, column:true}));
            break;
            case DOWN:
                this.selfArray.push(new FloorTile(this.x, this.y-1));
                this.selfArray.push(new WallTile(imgs.wallColumnTop, 3, this.x, this.y-1, {}));
                this.selfArray.push(new WallTile(imgs.wallColumnMid, 3, this.x, this.y, {obstructing:true}));
                break;
        }

        this.occupyingSpaces = this.selfArray.map(i => [i.x,i.y]);
    }
}

export default WallColumn