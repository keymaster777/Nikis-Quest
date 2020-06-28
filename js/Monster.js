class Monster{
    
    constructor(sprite, x, y){
        this.sprite = this.sprite({
            context: ctx,
            width: 64,
            height: 21,
            image: gnollShamanImage,
            numberOfFrames: 4,
            sizescale: .045,
        });
        this.x=(x*TS)+.5*TS;
        this.y=(y*TS)+.5*TS;
        this.layer=1;
        this.isFacingRight = true;
        this.rlhitbox=.4*TS;
        this.bothitbox=1.15*TS;
        this.speed=Math.random() + .75;
        this.setupSprite();
        this.attackedLast = Date.now();
        this.attackDamage = 3;
        this.hitPoints = 15;
        this.takingDamage = false;
        this.maxDamageFrames = 18;
    }
    
    setupSprite(){
        this.run_right_sprite = new Image();
        this.run_right_sprite.src = 'img/Mobs/GnollShaman_Walk_Right.png';
        this.run_left_sprite = new Image();
        this.run_left_sprite.src = 'img/Mobs/GnollShaman_Walk_Left.png';
    }

    move(){
        if (player.x < this.x-20) {
            this.sprite.image = this.run_left_sprite;
            if(!this.outOfBounds(this.x - this.speed, this.y)) this.x -= this.speed;
        } else if (player.x > this.x+20) {
            this.sprite.image = this.run_right_sprite;
            if(!this.outOfBounds(this.x + this.speed, this.y)) this.x += this.speed;
        }

        if (player.y < this.y-20) {
            if(!this.outOfBounds(this.x, this.y - this.speed)) this.y -= this.speed;
        } else if (player.y > this.y+20) {
            if(!this.outOfBounds(this.x, this.y + this.speed)) this.y += this.speed;
        }

        if ( this.distanceToPlayer() < 30) this.attack(player);
    }

    distanceToPlayer(){
        return ((player.x-this.x)**2 + (player.y-this.y)**2)**.5
    }

    attack(entity){
        if(Date.now() - this.attackedLast > 400){
            console.log("Monster Attacked");
            this.attackedLast = Date.now();
            entity.takeDamage(this.attackDamage);
        }
    }

    animations(){
        if(this.takingDamage) this.damageAnimation();
    }
    damageAnimation(){
        if(this.currentDamageFrame == this.maxDamageFrames){
            this.takingDamage = false;
        } else {
            this.currentDamageFrame % 2 == 0 ? this.x-=10 : this.x+=10;
            this.currentDamageFrame++;
        }
    }
    takeDamage(damage){
        if(this.takingDamage) return;
        this.currentDamageFrame = 0
        this.hitPoints -= damage;
        if (this.hitPoints <= 0){
            this.speed = 0;
            this.x = -1000;
        }
        this.takingDamage = true;
    }

    draw(debug){
        this.sprite.x = this.x-.35*TS;
        this.sprite.y = this.y-.85*TS;
        this.move();
        this.sprite.update();
        this.sprite.render();
        if (debug){
            ctx.fillStyle = "red";
            ctx.fillRect(this.x,this.y,5,5); // fill in the pixel at (10,10)
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
    sprite (options) {
				
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
}
