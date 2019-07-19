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
    if(input.isDown('DOWN') || input.isDown('s')) {
        if (!player.outOfBounds(player.x,(player.y+1.5*player.speed*dt)+player.bothitbox ) ){
            player.moveDown(1.5*player.speed * dt);
        }
    }

    if(input.isDown('UP') || input.isDown('w')) {
        if (!player.outOfBounds(player.x, player.y-1.5*player.speed*dt)){
            player.moveUp(1.5*player.speed * dt);
        }
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
        if (!player.outOfBounds((player.x - 1.5*player.speed * dt)-player.rlhitbox, player.y)){
            player.moveLeft(1.5*player.speed * dt);
        }
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        if (!player.outOfBounds((player.x + 1.5*player.speed * dt)+player.rlhitbox, player.y)){
            player.moveRight(1.5*player.speed * dt);
        }
    }

    if(input.isDown('SPACE')) {
        if(player.atDoor() && player.canLeave()){
            activeRoom.nextRoom();
        }
    }
}