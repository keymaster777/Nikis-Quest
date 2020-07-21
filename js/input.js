var isInput = false;

(function() {
    var pressedKeys = {};
    function setKey(event, status) {
        var code = event.keyCode;
        var key;

        switch(code) {
        case 32:
            key = 'SPACE'; break;
        case 37:
            key = 'LEFT'; break;
        case 38:
            key = 'UP'; break;
        case 39:
            key = 'RIGHT'; break;
        case 40:
            key = 'DOWN'; break;
            case 67:
            key = 'C'; break;
        default:
            // Convert ASCII codes to letters
            key = String.fromCharCode(code);
        }

        pressedKeys[key] = status;
    }

    document.addEventListener('keydown', function(e) {
        setKey(e, true);
    });

    document.addEventListener('keyup', function(e) {
        setKey(e, false);
    });

    window.addEventListener('blur', function() {
        pressedKeys = {};
    });

    window.input = {
        isDown: function(key) {
            return pressedKeys[key.toUpperCase()];
        }
    };
})();


function handleInput(dt) {
    isInput=false;
    if(input.isDown('s')) {
        if (!player.outOfBounds(player.x,(player.y+1.5*player.speed*dt)) ){
            player.move(dt, DOWN);
        }else{
            player.move(0, DOWN);
        }
        isInput = true;
    }

    if(input.isDown('w')) {
        if (!player.outOfBounds(player.x, player.y-1.5*player.speed*dt)){
            player.move(dt, UP);
        }else{
            player.move(0, UP);
        }
        isInput = true;
    }

    if(input.isDown('a')) {
        if (!player.outOfBounds((player.x - 1.5*player.speed * dt), player.y)){
            player.move(dt, LEFT);
        }else{
            player.move(0, LEFT);
        }
        isInput = true;
    }

    if(input.isDown('d')) {
        if (!player.outOfBounds((player.x + 1.5*player.speed * dt), player.y)){
            player.move(dt, RIGHT);
        }else{
            player.move(0, RIGHT);
        }
        isInput = true;
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

    if(player.atDoor() && player.canLeave()){
        activeRoom.nextRoom();
    }

    if(input.isDown('SPACE')) {
        player.dash();
    }
}