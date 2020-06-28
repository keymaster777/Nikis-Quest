class Player{
    
    constructor(sprite){
        this.sprite = sprite;
        this.x=activeRoom.spawnLocation["x"]*TS+.5*TS;
        this.y=activeRoom.spawnLocation["y"]*TS+.5*TS;
        this.layer=1;
        this.rlhitbox=.4*TS;
        this.bothitbox=.15*TS;
        this.speed=TS*1.5;
        this.setupSprite();
        this.dashedLast = Date.now();
        this.direction = DOWN;
        this.maxDashFrames = 10;
        this.maxDamageFrames = 12;
        console.log(activeRoom.tileArray);
        this.maxHitPoints = 100;
        this.hitPoints = this.maxHitPoints;
        this.takingDamage = false;
        this.attackDamage = 5;
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
            this.dashedLast = Date.now();
            this.dashEndLocation = [0,0];
            this.currentDashFrame = 0;
            this.isDashing = true;
            switch(this.direction){
                case RIGHT:
                    this.dashEndLocation = player.getClosestValidSpot(player.x + 2.2*TS, player.y);
                    break;
                case LEFT:
                    this.dashEndLocation = player.getClosestValidSpot(player.x - 2.2*TS, player.y);
                    break;
                case UP:
                    this.dashEndLocation = player.getClosestValidSpot(player.x, player.y - 2.2*TS);
                    break;
                case DOWN:
                    this.dashEndLocation = player.getClosestValidSpot(player.x, player.y + 2.2*TS);
                    break;
            }
            this.rise = player.y-this.dashEndLocation["y"];
            this.run = player.x-this.dashEndLocation["x"];
        } 
    }
    dashDamage(){
        let closeMonsters = activeRoom.monsters.filter(monster => monster.distanceToPlayer() < 30);
        closeMonsters.forEach(monster => this.attack(monster));
    }
    attack(entity){
        entity.takeDamage(this.attackDamage);
    }
    animations(){
        if(this.isDashing) this.dashAnimation();
        if(this.takingDamage) this.damageAnimation();
    }
    dashAnimation(){
        if(this.currentDashFrame == this.maxDashFrames){
            player.moveToClosestValidSpot();
            this.isDashing = false;
        } else {
            player.x -= this.run/this.maxDashFrames;
            player.y -= this.rise/this.maxDashFrames;
            this.dashDamage();
            this.currentDashFrame++;
        }
    }
    damageAnimation(){
        if(this.currentDamageFrame == this.maxDamageFrames){
            this.takingDamage = false;
        } else {
            this.currentDamageFrame % 2 == 0 ? this.x-=10 : this.x+=10;
            this.currentDamageFrame++;
        }
    }
    moveToClosestValidSpot(){
        let closestLocation = player.getClosestValidSpot(player.x, player.y);
        player.x=closestLocation["x"];
        player.y=closestLocation["y"];
    }
    getClosestValidSpot(x, y){
        let closestLocation = {x: x, y: y};
        for( let i = 0; player.outOfBounds(closestLocation["x"], closestLocation["y"]); i+=5){
            if(!player.outOfBounds(x-i, y)) closestLocation["x"]=x-i;
            else if(!player.outOfBounds(x-i*.5, y-i*.5)) closestLocation={x: x-i*.5, y: y-i*.5};
            else if(!player.outOfBounds(x, y+i)) closestLocation["y"]=y+i;
            else if(!player.outOfBounds(x+i*.5, y-i*.5)) closestLocation={x: x+i*.5, y: y-i*.5};
            else if(!player.outOfBounds(x+i, y)) closestLocation["x"]=x+i;
            else if(!player.outOfBounds(x+i*.5, y+i*.5)) closestLocation={x: x+i*.5, y: y+i*.5};
            else if(!player.outOfBounds(x, y-i)) closestLocation["y"]=y-i;
            else if(!player.outOfBounds(x-i*.5, y+i*.5)) closestLocation={x: x-i*.5, y: y+i*.5};
        }
        return closestLocation;
    }

    takeDamage(damage){
        if(this.takingDamage || this.isDashing) return;
        this.currentDamageFrame = 0
        this.hitPoints -= damage;
        if (this.hitPoints <= 0) window.location.reload(false);
        this.takingDamage = true;
    }
    spriteIdle(){
        this.sprite.width = 32;
        this.sprite.numberOfFrames = 1;
        this.sprite.image = this.idle;
        this.sprite.setFrame();
    }

    canLeave(){
        return (Date.now() - activeRoom.roomTime > 1000);
    }

    draw(debug){
        if (this.isDashing || this.takingDamage) ctx.globalAlpha = 0.6;
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
            ctx.fillRect(this.x,this.y,5,5); // fill in the pixel at (10,10)
        }
        ctx.globalAlpha = 1;
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
                if(
                    player.outOfBounds(player.x-3, player.y) ||
                    player.outOfBounds(player.x+3, player.y) ||
                    player.outOfBounds(player.x, player.y-3) ||
                    player.outOfBounds(player.x, player.y+3)
                ) return true;
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