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

class Chest extends Tile{
    constructor(x, y, TS){
        super(itemimgs[0], "*", x, y, TS);
        this.obstructing = true;
        this.hitPoints = 15;
        this.takingDamage = false;
        this.maxDamageFrames = 18;
    }

    animations(){
        if(this.takingDamage) this.damageAnimation();
    }

    damageAnimation(){
        if(this.currentDamageFrame == this.maxDamageFrames){
            this.takingDamage = false;
        } else {
            this.currentDamageFrame % 2 == 0 ? this.x-=.1 : this.x+=.1;
            this.currentDamageFrame++;
        }
    }

    takeDamage(damage){
        if(this.takingDamage) return;
        this.currentDamageFrame = 0
        this.hitPoints -= damage;
        if (this.hitPoints <= 0){
            activeRoom.tileArray = activeRoom.tileArray.filter(tile => tile != this)
            let random = Math.random();
            if(random >= .9){
                activeRoom.monsters.push(new Monster(this.x, this.y))
                activeRoom.monsters.push(new Monster(this.x, this.y))
            }
            if(random > .7){
                console.log("Stamina Pot spawn")
            } else {
                activeRoom.tileArray.push(new Potion(this.x, this.y, TS));
            }
        }
        this.takingDamage = true;
    }

    distanceToCoord(x1,y1){
        return ((x1-this.x*TS)**2 + (y1-this.y*TS)**2)**.5
    }

    inArea(x,y){
        if(this.obstructing && x>=this.x*TS+15 && x<this.x*TS+TS-15 &&  y>=this.y*TS+15 && y<this.y*TS+TS-10 ){
            return true;
        }else{
            return false;
        }
    }
}

class Potion extends Tile{
    constructor(x, y, TS){
        super(itemimgs[1], "*", x, y, TS);
        this.obstructing = false;
    }

    inArea(x,y){
        if( x>=this.x*TS+10 && x<this.x*TS+TS-10 &&  y>=this.y*TS+20 && y<this.y*TS+TS-10 ){
            return true;
        }else{
            return false;
        }
    }
} 

class FloorTile extends Tile{
    constructor(x, y, TS){
        super(randomFloor(), 0, x, y, TS);
    }

    randomFloor() {
        let random = Math.random();
        switch(true){
            case random < .05:
                return floorimgs[1];
                break;
            case random < .1:
                return floorimgs[2];
                break;
            case random < .15:
                return floorimgs[3];
                break;
            case random < .2:
                return floorimgs[4];
                break;
            case random < .225:
                return floorimgs[5];
                break;
            default:
                return floorimgs[0];
                break;
        }
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

class PitTile extends Tile{
    constructor(layer,x,y, room){
        super(x,y);
        this.room = room;
        this.tileimg = new Image();
        this.tileimg.src = 'img/sprites/edge.png';
        this.y = y;
        this.x = x;
        this.layer = layer;
        this.obstructing = true;
    }

    draw(){
        for(var i = 0; i < this.room.tileArray.length; i++){
            if(this.x == this.room.tileArray[i].x && this.y-1 == this.room.tileArray[i].y){
                if(this.room.tileArray[i] instanceof PitTile){
                    //Dont draw anything
                }else{
                    ctx.drawImage(this.tileimg, this.x*TS, this.y*TS, TS,TS);
                }
            }
        }
    }
    inArea(x,y){
        return x>=this.x*TS+(TS*.25) && x<this.x*TS+(TS*.75) && y>=this.y*TS && y<this.y*TS+TS ? true : false;
    }
    
}
