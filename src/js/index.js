import Level from './Level'
import {CANVAS_HEIGHT, CANVAS_WIDTH} from "./constants"
import { handleInput } from "./helpers";
import { setUpImages } from './images';
import Player from "./Player"
import Room from "./Room"
import OverlayManager from './OverlayManager';


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

  global.overlayManager = new OverlayManager()
  overlayManager.addPrimaryOverlay()
  overlayManager.addControlsInfoOverlay()
  overlayManager.addLevelStartOverlay()
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


function main() {
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Regen Components
    if (player.stamina < 100) player.stamina += 0.35;

    handleInput();

    activeRoom.drawRoom() 
    overlayManager.renderLayovers()
    if (level.isComplete()) overlayManager.addLevelCompleteOverlay()

    requestAnimationFrame(main);
};
