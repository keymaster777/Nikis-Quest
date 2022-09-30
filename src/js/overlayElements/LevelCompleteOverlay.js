import OverlayElement from "./OverlayElement"
import { CANVAS_WIDTH } from "../constants"

class LevelCompleteOverlay extends OverlayElement{
  constructor(){
    super(280, 200, "Level Complete Overlay", 1)
    this.width = CANVAS_WIDTH-560
    this.height = 245
  }

  beforeElementSetup(){
    this.timer = Date.now()
  }

  tearDownConditions(){
    return Date.now() - this.timer > 11*1000
  }

  elementTeardown(){
    level.nextLevel()
    super.elementTeardown()
  }

  render(){
    ctx.translate(this.x, this.y)

    ctx.textAlign = "center"
    ctx.fillStyle = "#111"
    ctx.globalAlpha = 0.75
    ctx.fillRect(0, 0, this.width, this.height)
    ctx.globalAlpha = 1.0

    ctx.fillStyle = "#ddd"
    ctx.font = "26px antiquityFont"
    ctx.fillText("LEVEL COMPLETE", this.width/2, 50)

    ctx.font = "36px bitPotionFont"
    ctx.fillText( "- Things are now harder", this.width/2, 95)
    ctx.fillText( "- Song references are now better", this.width/2, 120)
    ctx.fillText( "- Chorts are now faster", this.width/2, 145)
    ctx.fillText( "- Goblins have grown stronger", this.width/2, 170)

    let countDown = Math.abs(Math.floor((Date.now() - this.timer)/1000) - 10)
    ctx.fillText( `Proceeding to next level in ${countDown}`, this.width/2, 220)

    super.render()
  }
}

export default LevelCompleteOverlay