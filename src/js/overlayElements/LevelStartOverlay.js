import OverlayElement from "./OverlayElement"
import { CANVAS_WIDTH } from "../constants"

class LevelStartOverlay extends OverlayElement{
  constructor(){
    super(280, 200, "Level Start Overlay", 1)
    this.width = CANVAS_WIDTH-560
    this.height = 150
  }

  beforeElementSetup(){
    this.timer = Date.now()
  }

  tearDownConditions(){
    return Date.now() - this.timer > 3500
  }

  elementTeardown(){
    overlayManager.addExitInstructionsOverlay()
    overlayManager.addRoomMessageOverlay()
    super.elementTeardown()
  }

  render(){
    let transparency = 1

    if (Date.now() - this.timer > 1500){
      transparency = 1 - (Date.now() - this.timer - 1500)/1000*.5
      transparency = transparency > 0 ? transparency : 0
    }

    ctx.translate(this.x, this.y)

    ctx.textAlign = "center"
    ctx.fillStyle = "#111"
    ctx.globalAlpha = transparency * .75
    ctx.fillRect(0, 0, this.width, this.height)
    ctx.globalAlpha = transparency

    ctx.font = "52px antiquityFont"
    ctx.fillStyle = "#ddd"
    ctx.fillText("Quest", this.width/2+75, 130)
    ctx.fillStyle = "#c03a47"
    ctx.fillText("Niki's", this.width/2-75, 80)

    super.render()
  }
}

export default LevelStartOverlay