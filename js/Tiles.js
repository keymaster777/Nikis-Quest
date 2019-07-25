class Tile{
    tileImg = new Image();
    constructor(tileimg, layer, x, y, TS, debug = false){
        TS = TS;
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

class DoorTile2 extends Tile{
    constructor(tileimg, layer, x, y, direction){
        super(tileimg, layer, x, y);
        this.direction = direction;
    }
    
}


class WallTile2 extends Tile{
    
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
