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

function distance(x1, y1, x2, y2){
    return Math.sqrt((x2-x1)**2 + (y2-y1)**2)
}

function handleInput(dt, level) {

    if(input.isDown('UP')) {
        if(!player.isAttacking) {
            player.isAttacking = true;
            player.attackDirection = UP;
        }
    }

    if(input.isDown('RIGHT')) {
        if(!player.isAttacking) {
            player.isAttacking = true;
            player.attackDirection = RIGHT;
        }
    }

    if(input.isDown('DOWN')) {
        if(!player.isAttacking) {
            player.isAttacking = true;
            player.attackDirection = DOWN;
        }
    }

    if(input.isDown('LEFT')) {
        if(!player.isAttacking) {
            player.isAttacking = true;
            player.attackDirection = LEFT;
        }
    }

    if(player.atDoor() && (Date.now() - player.lastLeftRoomTime > 1000)){
        player.lastLeftRoomTime = Date.now()
        level.nextRoom();
    }
}

export {randomIntFromInterval, oppositeDirection, handleInput, distance}