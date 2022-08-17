import Level from './Level'
import {CANVAS_HEIGHT, CANVAS_WIDTH} from "./constants"
import { handleInput } from "./helpers";
import { setUpImages } from './images';
import Chest from './tiles/Chest';
import Player from "./Player"
import Room from "./Room"


var canvas = document.createElement("canvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

global.ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

( async () => {
  await setUpImages()
  startGame()
})()

const startGame = () => {
  // TODO: Move these into Level class as instance variables
  global.activeRoom = new Room(0,0)
  global.player = new Player(activeRoom.spawnLocation)
  global.level = new Level(1)
  main()
}

document.body.appendChild(canvas);

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




// The main game loop
let lastTime;
function main() {

    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // UI Components

    ctx.fillStyle = "#555";
    ctx.fillRect(10, 10, 200, canvas.height-20);

    ctx.drawImage(imgs.heart, 20, 20, 25, 25);

    ctx.fillStyle = "#111"
    ctx.fillRect(50, 20, 150, 25);

    ctx.fillStyle = "#c03a47"
    ctx.fillRect(52, 22, 146*(player.hitPoints/player.maxHitPoints), 21);

    ctx.fillStyle = "#5dBB63"
    ctx.font = "26px Arial";
    ctx.fillText("E", 23, 76); 

    ctx.fillStyle = "#111"
    ctx.fillRect(50, 55, 150, 25);

    ctx.fillStyle = "#5dBB63"
    ctx.fillRect(52, 57, 146*(player.stamina/player.maxStamina), 21);

    // Regen Components
    if (player.stamina < 100) player.stamina += 0.25;

    let now = Date.now();
    let dt = (now - lastTime) / 1000.0;
    handleInput(dt, level);

    activeRoom.drawRoom();

    lastTime = now;
    player.animations();
    activeRoom.monsters.forEach(monster => monster.animations());
    activeRoom.tileArray.filter(tile => tile instanceof Chest).forEach(tile => tile.animations())

    requestAnimationFrame(main);
};

