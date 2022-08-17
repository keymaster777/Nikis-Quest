import Structure from "./Structure";
import FloorTile from "../tiles/FloorTile";
import WallTile2 from "../tiles/WallTile2";

class FloorColumn extends Structure{
    constructor(x, y){
        super(x,y);
        this.build();
    }

    build(){
        this.selfArray.push(new FloorTile(this.x, this.y-1));
        this.selfArray.push(new FloorTile(this.x, this.y));
        this.selfArray.push(new WallTile2(imgs.columnBase, 2, this.x, this.y, {obstructing:true, column: true}));
        this.selfArray.push(new WallTile2(imgs.columnMid, '*', this.x, this.y-1, {}));
        let random = Math.random();

        if(random > .7){
            this.selfArray.push(new WallTile2(imgs.columnMid, 3, this.x, this.y-2, {}));
            this.selfArray.push(new WallTile2(imgs.columnTop, 3, this.x, this.y-3, {}));
        } else {
            this.selfArray.push(new WallTile2(imgs.columnTop, 3, this.x, this.y-2, {}));
        }

        this.occupyingSpaces = [[this.x,this.y],[this.x,this.y-1]];
    }
}

export default FloorColumn