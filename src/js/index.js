import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants"
import { handleInput, getMousePosition, setGame } from "./helpers"
import { setUpImages } from "./images"
import BitPotion from "../fonts/BitPotion.ttf"
import AntiquityPrint from "../fonts/antiquity-print.ttf"

let canvas = document.createElement("canvas")
let bitPotionFont = new FontFace("bitPotionFont", `url(${BitPotion})`)
let antiquityPrintFont = new FontFace("antiquityFont", `url(${AntiquityPrint})`)

canvas.width = CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT

global.ctx = canvas.getContext("2d")
ctx.imageSmoothingEnabled = false

if(localStorage.getItem("deathCount") === null) localStorage.setItem("deathCount", 0)
if(localStorage.getItem("freeCam") === null) localStorage.setItem("freeCam", 0)
if(localStorage.getItem("showFps") === null) localStorage.setItem("showFps", 0)

// For Fps tracking
let fpsLastCalled = performance.now()
let fpsLastShown = performance.now()
let avgFps = 0
let fpsBuffer = []

// For Fps locking
let fpsTarget = 60
let interval = (1000 / fpsTarget)
let timeThen = performance.now()
let timeNow
let delta


( async () => {
  document.fonts.add(bitPotionFont)
  document.fonts.add(antiquityPrintFont)
  await setUpImages()
  startGame()
})()

const startGame = () => {
  setGame()
  main()
}

document.body.appendChild(canvas)
let img = document.createElement("img")
img.setAttribute("id", "canvasimg")
document.body.appendChild(img);

(function() {
  var pressedKeys = {}
  function setKey(event, status) {
    var code = event.keyCode
    var key

    switch(code) {
    case 32:
      key = "SPACE"; break
    case 37:
      key = "LEFT"; break
    case 38:
      key = "UP"; break
    case 39:
      key = "RIGHT"; break
    case 40:
      key = "DOWN"; break
    case 67:
      key = "C"; break
    default:
      // Convert ASCII codes to letters
      key = String.fromCharCode(code)
    }

    pressedKeys[key] = status
  }

  document.addEventListener("keydown", function(e) {
    setKey(e, true)
  })

  document.addEventListener("keyup", function(e) {
    setKey(e, false)
  })

  window.addEventListener("blur", function() {
    pressedKeys = {}
  })

  window.input = {
    isDown: function(key) {
      return pressedKeys[key.toUpperCase()]
    }
  }
})()

let canvasElem = document.querySelector("canvas")

canvasElem.addEventListener("mousedown", (e) => {
  let mousePosition = getMousePosition(canvasElem, e)
  overlayManager.buttonBoxes.forEach(button => {
    console.log(button.coords())
    if(button.containsPoint(mousePosition)){
      button.triggerEvent()
    }
  })
})

function showAvgFps() {
  let now = performance.now()
  let delta = (now - fpsLastCalled)/1000
  fpsLastCalled = now
  fpsBuffer.push(1/delta)

  if(now - fpsLastShown > 1000){
    fpsLastShown = now
    avgFps = fpsBuffer.reduce((a, b) => a + b, 0)/fpsBuffer.length
    fpsBuffer = []
  }
  ctx.textAlign = "left"

  ctx.fillStyle = "white"
  if(avgFps < fpsTarget*.9) ctx.fillStyle = "red"

  ctx.font = "24px bitPotionFont"
  ctx.fillText(`fps: ${Math.min(~~avgFps, fpsTarget)}`, CANVAS_WIDTH - 262, CANVAS_HEIGHT-10)
}

function main() {
  requestAnimationFrame(main)

  timeNow = performance.now()
  delta = timeNow - timeThen

  if(delta > interval) {
    handleInput()
    ctx.fillStyle = "#1a1a1a"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    activeRoom.drawRoom()
    overlayManager.renderOverlays()

    if (level.isComplete()) overlayManager.addLevelCompleteOverlay()

    timeThen = timeNow - (delta % interval)
  }

  if(localStorage.getItem("showFps") === "1") showAvgFps()
}
