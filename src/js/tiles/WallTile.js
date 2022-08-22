import Tile from "./Tile"
import {TS} from "../constants"

class WallTile extends Tile{
    
    constructor(tileimg, layer, x, y, options){
        super(tileimg, layer, x, y);
        this.options = options || {};
        this.obstructing = options.obstructing || false;
        this.hitboxLeft = options.hitboxLeft || false;
        this.hitboxRight = options.hitboxRight || false;
        this.column = options.column || false;
        this.debug = false;
    }


    inArea(x,y){
        if(this.hitboxRight){
            return x>=this.x*TS+.75*TS && x<this.x*TS+TS && y>=this.y*TS && y<=this.y*TS+TS ? true : false;
        }
        if(this.hitboxLeft){
            return x>=this.x*.25*TS && x<this.x*TS+.25*TS && y>=this.y*TS && y<=this.y*TS+TS ? true : false;
        }
        if(this.column){
            return x>=this.x*TS+(TS*.2) && x<this.x*TS+(TS*.8) && y>=this.y*TS-(TS*.2) && y<this.y*TS+(.5*TS) ? true : false;
        }
        if(x>=this.x*TS && x<this.x*TS+TS && y>=this.y*TS && y<this.y*TS+TS ){
            return true;
        }else{
            return false;
        }
    }
}

export default WallTile