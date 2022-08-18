import {TS, UP, DOWN, LEFT, RIGHT} from './constants'

function randomIntFromInterval(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function oppositeDirection(direction){
    switch(direction){
        case UP:
            return DOWN;
        case DOWN:
            return UP;
        case LEFT:
            return RIGHT;
        case RIGHT:
            return LEFT;
    }
}

function handleInput(dt, level) {

    player.isMoving = false

    if(input.isDown('s')) {
        if (!player.outOfBounds(player.x,(player.y+1.5*player.speed*dt)) ){
            player.move(dt, DOWN);
        }else{
            player.move(0, DOWN);
        }
    }

    if(input.isDown('w')) {
        if (!player.outOfBounds(player.x, player.y-1.5*player.speed*dt)){
            player.move(dt, UP);
        }else{
            player.move(0, UP);
        }
    }

    if(input.isDown('a')) {
        if (!player.outOfBounds((player.x - 1.5*player.speed * dt), player.y)){
            player.move(dt, LEFT);
        }else{
            player.move(0, LEFT);
        }
    }

    if(input.isDown('d')) {
        if (!player.outOfBounds((player.x + 1.5*player.speed * dt), player.y)){
            player.move(dt, RIGHT);
        }else{
            player.move(0, RIGHT);
        }
    }

    if(input.isDown('UP')) {
        if(!player.isAttacking) {
            player.isAttacking = true;
            player.attackDirection = UP;
            player.attackFrame = 0;
        }
    }

    if(input.isDown('RIGHT')) {
        if(!player.isAttacking) {
            player.isAttacking = true;
            player.attackDirection = RIGHT;
            player.attackFrame = 0;
        }
    }

    if(input.isDown('DOWN')) {
        if(!player.isAttacking) {
            player.isAttacking = true;
            player.attackDirection = DOWN;
            player.attackFrame = 0;
        }
    }

    if(input.isDown('LEFT')) {
        if(!player.isAttacking) {
            player.isAttacking = true;
            player.attackDirection = LEFT;
            player.attackFrame = 0;
        }
    }

    if(player.atDoor() && (Date.now() - player.lastLeftRoomTime > 1000)){
        player.lastLeftRoomTime = Date.now()
        level.nextRoom();
    }

    if(input.isDown('SPACE')) {
        player.dash();
    }
}

function sprite (options) {
    var that = {},
    frameIndex = 0,
    tickCount = 0,
    ticksPerFrame = 8;
    that.numberOfFrames = options.numberOfFrames || 1;
    that.context = ctx;
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;
    that.sizescale = options.sizescale || 1;
    that.defaultSize = options.defaultSize || false;
    that.x = options.x || TS;
    that.y = options.y || TS;
    that.xAdjust = 0
    that.loop = options.loop;

    that.setFrame = (newFrameIndex) => frameIndex = newFrameIndex

    that.update = function () {

        tickCount += 1;
			
        if (that.numberOfFrames == 1 || tickCount > ticksPerFrame) {
        
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
                (that.x + that.xAdjust),
                that.y,
                TS,
                TS
            );
            
        }else{
            that.context.drawImage(
                that.image,
                frameIndex * that.width / that.numberOfFrames,
                0,
                that.width / that.numberOfFrames,
                that.height,
                (that.x + that.xAdjust),
                that.y,
                TS*that.sizescale*that.width / that.numberOfFrames,
                TS*that.sizescale*that.height
            );
        }
    };

    that.draw = function () {
        that.update()
        that.render()
    }

    return that;
}



export {randomIntFromInterval, oppositeDirection, handleInput, sprite}