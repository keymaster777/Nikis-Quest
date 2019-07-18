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
    sameCoord(Tile){
        return Tile.x == this.x && Tile.y == this.y;
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
        this.hitbox = options.hitbox || false;
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
