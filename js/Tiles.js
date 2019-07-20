class Tile{
    tileImg = new Image();
    constructor(tileimg, layer, x, y, TS){
        TS = TS;
        this.x = x;
        this.y = y;
        this.layer=layer;
        this.tileimg = tileimg;
    }

    draw(){
        ctx.drawImage(this.tileimg, this.x*TS, this.y*TS, TS,TS);
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

class Item extends Tile{
    constructor(tileimg, layer, x, y, TS, obstructing = false){
        super(tileimg, layer, x, y, TS);
        this.obstructing = obstructing;
    }

    inArea(x,y){
        if(this.obstructing && x>=this.x*TS && x<this.x*TS+TS &&  y>=this.y*TS && y<this.y*TS+TS ){
            return true;
        }else{
            return false;
        }
    }
}

class FloorTile extends Tile{
    constructor(tileimg, layer, x, y, TS){
        super(tileimg, layer, x, y, TS);
    }
}
class DoorTile extends Tile{
    constructor(tileimg, layer, x, y, TS, direction){
        super(tileimg, layer, x, y, TS);
        this.direction = direction;
    }
}
class WallTile extends Tile{
    constructor(tileimg, layer, x, y, TS, options){
        super(tileimg, layer, x, y, TS);
        this.obstructing = options.obstructing || false;
        this.hitboxLeft = options.hitboxLeft || false;
        this.hitboxRight = options.hitboxRight || false;
    }
    inArea(x,y){
        if(this.hitboxRight && x>=this.x*TS+.5*TS && x<this.x*TS+TS &&  y>=this.y*TS && y<this.y*TS+TS ){
            return true
        }
        if(this.hitboxLeft && x>=this.x*.5*TS && x<this.x*TS+.5*TS &&  y>=this.y*TS && y<this.y*TS+TS ){
            return true
        }
        if(!this.hitboxLeft && !this.hitboxRight && x>=this.x*TS && x<this.x*TS+TS &&  y>=this.y*TS && y<this.y*TS+TS ){
            return true;
        }else{
            return false;
        }
    }
}
