import OverlayElement from "./OverlayElement"
import { CANVAS_WIDTH } from "../constants"

class YouDiedOverlay extends OverlayElement{
  constructor(){
    super(280, 200, "You Died Overlay", 1)
    this.width = CANVAS_WIDTH-560
    this.height = 205
  }

  beforeElementSetup(){
    player.speed = 0
    player.dashSpeed = 0
    this.timer = Date.now()
  }

  tearDownConditions(){
    return Date.now() - this.timer > 6*1000
  }

  elementTeardown(){
    window.location.reload(false)
    super.elementTeardown()
  }

  render(){
    ctx.translate(this.x, this.y)

    ctx.fillStyle = "#111"
    ctx.globalAlpha = 0.75
    ctx.fillRect(0, 0, this.width, this.height)
    ctx.globalAlpha = 1.0

    ctx.textAlign = "center"

    ctx.fillStyle = "#c03a47"
    // ctx.font = "70px Arial"
    ctx.font = "39px antiquityFont"
    ctx.fillText("You Woke Up", this.width/2, 75)

    ctx.font = "36px bitPotionFont"

    ctx.fillStyle = "#ddd"

    ctx.fillText( "*in a cold sweat*", this.width/2, 110)

    let countDown = Math.abs(Math.min(0, Math.floor((Date.now() - this.timer)/1000) - 5))
    ctx.fillText( `Falling back asleep in ${countDown}`, this.width/2, 180)

    super.render()
  }
}

export default YouDiedOverlay