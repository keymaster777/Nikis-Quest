class Player{
    
    constructor(sprite){
        this.sprite = sprite;
        this.x=2*TS;
        this.y=3*TS;
        this.layer=1;
        this.rlhitbox=.4*TS;
        this.bothitbox=.15*TS;
        this.speed=TS*1.5;
        this.setupSprite();
        this.dashedLast = Date.now();
        this.direction;

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
        this.idle_down = new Image();
        this.idle_down.src = 'img/player/idle-down.png';
        this.idle_right = new Image();
        this.idle_right.src = 'img/player/idle-right.png';
        this.idle_left = new Image();
        this.idle_left.src = 'img/player/idle-left.png'
        this.idle_up = new Image();
        this.idle_up.src = 'img/player/idle-up.png'
        this.idle = new Image();
        this.idle = this.idle_down;
        this.weapon = new Image();
        this.weapon.src = 'img/sprites/weapon_golden_sword.png';

    }

    move(dt, direction = false){
        let distance = this.speed*1.5*dt
        this.sprite.width = 256;
        this.sprite.numberOfFrames = 8;
        switch(direction){
            case DOWN:
                this.direction = DOWN;
                this.y+=distance;
                this.sprite.image = this.run_down_sprite;
                this.idle = this.idle_down;
                break;
            case UP:
                this.direction = UP;
                this.y-=distance;
                this.sprite.image = this.run_up_sprite;
                this.idle = this.idle_up;
                break;
            case LEFT:
                this.direction = LEFT;
                this.x-=distance;
                this.sprite.image = this.run_left_sprite;
                this.idle = this.idle_left;
                break;
            case RIGHT:
                this.direction = RIGHT;
                this.x+=distance;
                this.sprite.image = this.run_right_sprite;
                this.idle = this.idle_right;
                break;
        }
    }

    dash(){
        if(Date.now() - this.dashedLast > 500){
            console.log("Dashed");
            this.dashedLast = Date.now();
            switch(this.direction){
                case RIGHT:
                    player.x += 2.5*TS;
                    break;
                case LEFT:
                    player.x -= 2.5*TS;
                    break;
                case UP:
                    player.y -= 2.5*TS;
                    break;
                case DOWN:
                    player.y += 2.5*TS;
                    break;
            }
            if (player.outOfBounds(player.x,player.y)) player.moveToClosestValidSpot();
        }
    }
    moveToClosestValidSpot(){
        let closestLocation = {x: player.x, y: player.y};
        for( let i = 0; player.outOfBounds(closestLocation["x"], closestLocation["y"]); i+=5){
            if(!player.outOfBounds(player.x-i, player.y)) closestLocation["x"]=player.x-i;
            if(!player.outOfBounds(player.x+i, player.y)) closestLocation["x"]=player.x+i;
            if(!player.outOfBounds(player.x, player.y-i)) closestLocation["y"]=player.y-i;
            if(!player.outOfBounds(player.x, player.y+i)) closestLocation["y"]=player.y+i;
        }
        player.x=closestLocation["x"];
        player.y=closestLocation["y"];
    }

    spriteIdle(){
        this.sprite.width = 32;
        this.sprite.numberOfFrames = 1;
        this.sprite.image = this.idle;
        this.sprite.setFrame();
    }

    canLeave(){
        return (Date.now() - activeRoom.roomTime > 500);
    }

    draw(debug){
        if(debug){this.speed = 3*TS;}
        debug = debug || false;
        this.sprite.x = player.x-.65*TS;
        this.sprite.y = player.y-1*TS;
        this.sprite.update();
        this.sprite.render();
        if(!isInput){
            this.spriteIdle();
        }
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
        let obstructing = activeRoom.tileArray.filter(tile => tile.obstructing == true);
        let list = [];
        for (var it = x -this.rlhitbox; it <= x+this.rlhitbox; it++) {
            list.push(it);
        }
        for(var i = 0;i<obstructing.length;i++){
            for(var i2 = 0; i2<list.length;i2++){
                if( obstructing[i].inArea(list[i2], y)){
                    return true;
                }
            }
        }
        if(( y<TS || y>(activeRoom.height+1)*TS)||(x>(activeRoom.width)*TS)||x<0){
            return true;
        }
    }

    atDoor(){
        var doors=activeRoom.tileArray.filter(tile => tile instanceof DoorTile2);
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
    ticksPerFrame = 8;
    that.numberOfFrames = options.numberOfFrames || 1;
    that.context = options.context;
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;
    that.sizescale = options.sizescale || 1;
    that.defaultSize = options.defaultSize || false;
    that.x = options.x || TS;
    that.y = options.y || TS;
    that.loop = options.loop;

    that.setFrame = function(){
        frameIndex = 0;
    }

    that.update = function () {

        tickCount += 1;
			
        if (tickCount > ticksPerFrame) {
        
        	tickCount = 0;
        	
            // Go to the next frame
            if (frameIndex < that.numberOfFrames - 1) {	
                // Go to the next frame
                frameIndex += 1;
            } else {
                frameIndex = 0;
            }
        }
    }; 

    that.render = function () {

        // Draw the animation
        if(that.defaultSize == true){
            that.context.drawImage(
                that.image,
                frameIndex * that.width / that.numberOfFrames,
                0,
                that.width / that.numberOfFrames,
                that.height,
                that.x,
                that.y,
                TS,
                TS);
            
        }else{
        that.context.drawImage(
           that.image,
           frameIndex * that.width / that.numberOfFrames,
           0,
           that.width / that.numberOfFrames,
           that.height,
           that.x,
           that.y,
           TS*that.sizescale*that.width / that.numberOfFrames,
           TS*that.sizescale*that.height);
        }
    };

    return that;
}