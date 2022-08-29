import {TS} from '../constants'

class Tile{
    constructor(tileimg, layer, x, y, debug = true){
        this.x = x;
        this.y = y;
        this.layer=layer;
        this.tileimg = tileimg;
        this.enabled = true;
        this.debug = debug;
    }


    draw(){
        ctx.drawImage(this.tileimg, this.x*TS, this.y*TS, TS,TS);
        // this.drawDebug()
    }

    drawDebug(){
        ctx.save;
        ctx.textAlign = 'center'
        ctx.fillStyle = "red"
        ctx.font = "16px Arial";

        ctx.fillText(`${this.x}, ${this.y}`, this.x*TS+TS*.5, this.y*TS+TS*.5);
        ctx.restore;
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