class Player{
    
    constructor(sprite){
        this.sprite = sprite;
        this.x=2*TS;
        this.y=3*TS;
        this.layer=1;
        this.rlhitbox=.2*TS;
        this.bothitbox=.15*TS;
        this.speed=TS*1.5;
        this.setupSprite();

    }

    
    setupSprite(){
        this.run_right_sprite = new Image();
        this.run_right_sprite.src = 'img/player/run-right.png';
        this.run_left_sprite = new Image();
        this.run_left_sprite.src = 'img/player/run-left.png';
        this.run_up_sprite = new Image();
        this.run_up_sprite.src = 'img/player/run-up.png';
        this.run_down_sprite = new Image();
        this.run_down_sprite.src = 'img/player/run-down.png';
    }

    moveRight(distance){
        this.x+=distance;
        this.sprite.image = this.run_right_sprite;
    }
    moveLeft(distance){
        this.x-=distance;
        this.sprite.image = this.run_left_sprite;
    }
    moveUp(distance){
        this.y-=distance;
        this.sprite.image = this.run_up_sprite;
    }
    moveDown(distance){
        this.y+=distance;
        this.sprite.image = this.run_down_sprite;
    }

    canLeave(){
        return (Date.now() - activeRoom.roomTime > 500);
    }

    draw(debug){
        if(debug){this.speed = 3*TS;}
        debug = debug || false;
        this.sprite.update();
        this.sprite.render();
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

function sprite (options) {
				
    var that = {},
    frameIndex = 0,
    tickCount = 0,
    ticksPerFrame = 8,
    numberOfFrames = options.numberOfFrames || 1;
					
    that.context = options.context;
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;

    that.loop = options.loop;

    that.update = function () {

        tickCount += 1;
			
        if (tickCount > ticksPerFrame) {
        
        	tickCount = 0;
        	
            // Go to the next frame
            if (frameIndex < numberOfFrames - 1) {	
                // Go to the next frame
                frameIndex += 1;
            } else {
                frameIndex = 0;
            }
        }
    }; 

    that.render = function () {

        // Draw the animation
        that.context.drawImage(
           that.image,
           frameIndex * that.width / numberOfFrames,
           0,
           that.width / numberOfFrames,
           that.height,
           player.x-.6*TS,
           player.y-.9*TS,
           TS*.04*that.width / numberOfFrames,
           TS*.04*that.height);
    };

    return that;
}