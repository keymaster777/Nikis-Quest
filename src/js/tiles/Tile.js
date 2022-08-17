import {TS} from '../constants'

class Tile{
    constructor(tileimg, layer, x, y, debug = false){
        this.x = x;
        this.y = y;
        this.layer=layer;
        this.tileimg = tileimg;
        this.enabled = true;
        this.debug = debug;
    }


    draw(){
        if(this.debug == true){
            ctx.save;
            ctx.globalAlpha=.04;
            ctx.drawImage(this.tileimg, this.x*TS, this.y*TS, TS,TS);
            ctx.restore;
        }
        if(this.enabled && this.debug == false){
          ctx.drawImage(this.tileimg, this.x*TS, this.y*TS, TS,TS);
        }
    }

    toString() {
        return '['+this.x+','+this.y+']';
    }
    area(){
        return "Area: ("+ this.x*TS + ", " + this.y*TS + "), (" + this.x*TS+TS + ", " + this.y*TS+TS + ")";
    }

    inArea(x,y){
        if( x>=this.x*TS && x<this.x*TS+TS &&  y>=this.y*TS && y<this.y*TS+TS ){
            return true;
        }else{
            return false;
        }
    }
    sameCoord(Tile, xshift = 0, yshift = 0){
        return Tile.x + xshift == this.x && Tile.y + yshift == this.y;
    }
}

export default Tile