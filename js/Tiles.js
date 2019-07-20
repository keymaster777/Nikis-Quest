class Tile{
    tileImg = new Image();
    constructor(tileimg, layer, x, y, TS){
        TS = TS;
        this.x = x;
        this.y = y;
        this.layer=layer;
        this.tileimg = tileimg;
    }

    preDraw(room){
        return;
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
class WallTile extends Tile{
    constructor(tileimg, layer, x, y, TS, options){
        super(tileimg, layer, x, y, TS);
        this.obstructing = options.obstructing || false;
        this.hitboxLeft = options.hitboxLeft || false;
        this.hitboxRight = options.hitboxRight || false;
    }
    inArea(x,y){
        if(this.hitboxRight && x>=this.x*TS+.75*TS && x<this.x*TS+TS && y>=this.y*TS && y<=this.y*TS+TS ){
            return true
        }
        if(this.hitboxLeft && x>=this.x*.25*TS && x<this.x*TS+.25*TS && y>=this.y*TS && y<=this.y*TS+TS ){
            return true
        }
        if(!this.hitboxLeft && !this.hitboxRight && x>=this.x*TS && x<this.x*TS+TS && y>=this.y*TS && y<this.y*TS+TS ){
            return true;
        }else{
            return false;
        }
    }
}

class DoorTile extends Tile{
    constructor(tileimg, layer, x, y, TS, direction){
        super(tileimg, layer, x, y, TS);
        this.direction = direction;
    }

    preDraw(room){
        console.log("prebuild door")
        let indexOfOld;
        switch(this.direction){
            case DOWN:
            case UP:
                indexOfOld = findTile(room.tileArray, this.x, this.y-1, {constructorName: "WallTile"});
                room.tileArray[indexOfOld] = new WallTile(wallimgs[15], 2 , this.x, this.y-1, TS, { obstructing: false}); 
                break;
            case LEFT:
                indexOfOld = findTile(room.tileArray, this.x, this.y-1 ,{constructorName: "WallTile"});
                room.tileArray[indexOfOld] = new WallTile(wallimgs[17], 1, this.x, this.y-1, TS, { obstructing: true, hitboxLeft:true});
                room.tileArray.push(new WallTile(wallimgs[19], 2, this.x, this.y, TS, { obstructing: false}));
                break;
            case RIGHT:
                indexOfOld = findTile(room.tileArray, this.x, this.y-1,{constructorName: "WallTile"});
                room.tileArray[indexOfOld] = new WallTile(wallimgs[16], 1, this.x, this.y-1, TS, { obstructing: true, hitboxRight:true});
                room.tileArray.push(new WallTile(wallimgs[18], 2, this.x, this.y, TS, { obstructing: false})); 
                break;
        }

    }
}

function findTile(array, x , y, options){
    this.constructorName = options.constructorName || "Tile";
    for(var i = array.length-1; i>0;i--){
        if(array[i].x == x && array[i].y == y && array[i].constructor.name == constructorName){
            return i;
        }
    }
}
