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
  global.player = new Player()
  global.level = new Level(1)
  level.buildOutRooms()
  player.setLocation(activeRoom.spawnLocation.x, activeRoom.spawnLocation.y)

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

    // UI Components Left Side

    ctx.fillStyle = "#555";
    ctx.fillRect(10, 10, 200, canvas.height-20);

    ctx.drawImage(imgs.heart, 20, 20, 25, 25);

    ctx.fillStyle = "#111"
    ctx.fillRect(50, 20, 150, 25);

    ctx.fillStyle = "#c03a47"
    ctx.fillRect(52, 22, 146*(player.hitPoints/player.maxHitPoints), 21);

    ctx.fillStyle = "#5dBB63"
    ctx.font = "26px Arial";
    ctx.textAlign = "left"
    ctx.fillText("E", 23, 76); 

    ctx.fillStyle = "#111"
    ctx.fillRect(50, 55, 150, 25);

    ctx.fillStyle = "#5dBB63"
    ctx.fillRect(52, 57, 146*(player.stamina/player.maxStamina), 21);

    level.drawMap(20, 105)

    level.drawCompletionCriteria(20, 320)

    // Current room coords
    ctx.fillStyle = "#b8b5b9"
    ctx.textAlign = "center"
    ctx.font = "16px Arial";
    ctx.fillText(`Dungeon Level: ${level.levelNum}`,110, canvas.height-20);
    ctx.fillText(`Enemies Felled: ${player.enemiesFelled}`,110, canvas.height-60);
    ctx.fillText(`Chests Opened: ${player.chestsOpened}`,110, canvas.height-80);
    ctx.fillText(`Potions Devoured: ${player.potionsConsumed}`,110, canvas.height-100);

    // UI Components Right Side
    
    ctx.fillStyle = "#555";
    ctx.fillRect(canvas.width-210, 10, 200, canvas.height-20);

    ctx.textAlign = 'center'
    ctx.fillStyle = "#b8b5b9"
    ctx.font = "16px Arial";

    ctx.drawImage(imgs.letterW, canvas.width-135, 100, 50, 50);
    ctx.drawImage(imgs.letterA, canvas.width-185, 150, 50, 50);
    ctx.drawImage(imgs.letterS, canvas.width-135, 150, 50, 50);
    ctx.drawImage(imgs.letterD, canvas.width-85, 150, 50, 50);

    ctx.fillText("TO MOVE AROUND", canvas.width-110, 220);

    ctx.drawImage(imgs.upArrow, canvas.width-135, 240, 50, 50);
    ctx.drawImage(imgs.leftArrow, canvas.width-185, 290, 50, 50);
    ctx.drawImage(imgs.downArrow, canvas.width-135, 290, 50, 50);
    ctx.drawImage(imgs.rightArrow, canvas.width-85, 290, 50, 50);

    ctx.fillText("TO ATTACK", canvas.width-110, 360);

    ctx.drawImage(imgs.spaceBar, canvas.width-185, 380, 150, 50);

    ctx.fillText("TO DASH", canvas.width-110, 450);

    // Regen Components
    if (player.stamina < 100) player.stamina += 0.25;

    let now = Date.now();
    let dt = (now - lastTime) / 1000.0;
    handleInput(dt, level);

    activeRoom.drawRoom();

    if (level.isComplete()){
        ctx.fillStyle = "#111";
        ctx.globalAlpha = 0.75
        ctx.fillRect(280, 200, canvas.width-560, 245); 
        ctx.globalAlpha = 1.0 

        ctx.fillStyle = "#ddd";
        ctx.font = "40px Arial"
        ctx.fillText("LEVEL COMPLETE", canvas.width/2, canvas.height/2 -35)

        ctx.font = "20px Arial"

        ctx.fillText( "- Things are now harder", canvas.width/2, canvas.height/2 +10)
        ctx.fillText( "- Song references are now better", canvas.width/2, canvas.height/2 +35)
        ctx.fillText( "- Chorts are now faster", canvas.width/2, canvas.height/2 +60)
        ctx.fillText( "- Goblins have grown stronger", canvas.width/2, canvas.height/2 +85)

        let countDown = Math.abs(Math.floor((Date.now() - player.lastLeftRoomTime)/1000) - 10) 
        ctx.fillText( `Proceeding to next level in ${countDown}`, canvas.width/2, canvas.height/2 +125)
        if( Date.now() - player.lastLeftRoomTime > 11*1000){
            activeRoom = new Room(0,0)
            activeRoom.visited = true
            level = new Level(level.levelNum + 1)
            level.buildOutRooms()
            player.setLocation(activeRoom.spawnLocation.x, activeRoom.spawnLocation.y)
        }
    }
    lastTime = now;
    player.animations();
    activeRoom.monsters.forEach(monster => monster.animations());
    activeRoom.tileArray.filter(tile => tile instanceof Chest).forEach(tile => tile.animations())

    requestAnimationFrame(main);
};

