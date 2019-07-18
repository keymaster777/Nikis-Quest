class Player{
    constructor(){
        this.x=2*TS;
        this.y=3*TS;
        this.layer=1;
        this.rlhitbox=.2*TS;
        this.bothitbox=.15*TS;
        this.speed=TS;
    }

    canLeave(){
        return (Date.now() - activeRoom.roomTime > 500);
    }

    draw(debug){
        if(debug){this.speed = 3*TS;}
        debug = debug || false;
        knight_sprite.update();
        knight_sprite.render();
        if (debug){
            ctx.fillStyle = "red";
            ctx.fillRect(this.x,this.y,10,10); // fill in the pixel at (10,10)
        }
    }
    setLocation(x,y){
        this.x=x;
        this.y=y;
    }
    outOfBounds(x,y){
        var walls=activeRoom.tileArray.filter(tile => tile instanceof WallTile);
        for(var i = 0;i<walls.length;i++){
            if( walls[i].inArea(x,y) && walls[i].hitbox){
                return true;
            }
        }
        if((y>(activeRoom.height+1)*TS)||(x>(activeRoom.width)*TS)||x<0){
            return true;
        }
    }

    atDoor(){
        var doors=activeRoom.tileArray.filter(tile => tile instanceof DoorTile);

        for(var i = 0;i<doors.length;i++){
            if( doors[i].inArea(this.x,this.y)){
                return true;
            }
        }
    }
}