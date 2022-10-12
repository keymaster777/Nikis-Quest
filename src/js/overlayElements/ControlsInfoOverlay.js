import OverlayElement from "./OverlayElement"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../constants"
import BoundingRectangle from "../boundingAreas/BoundingRectange"

class ControlsInfoOverlay extends OverlayElement{
  constructor(){
    super(CANVAS_WIDTH-210, 10, "Controls Info Overlay", 1)
    this.width = 200
    this.height = CANVAS_HEIGHT-20

    let freeCamBox = new BoundingRectangle({
      coords: (() => ({ x: this.x+20, y: this.y+this.height-30 })),
      width: 20,
      height: 20,
      triggerEvent: (() => freeCam = !freeCam)
    })
    this.buttonBoxes.push(freeCamBox)

    let showFpsBox = new BoundingRectangle({
      coords: (() => ({ x: this.x+20, y: this.y+this.height-60 })),
      width: 20,
      height: 20,
      triggerEvent: (() => showFps = !showFps)
    })
    this.buttonBoxes.push(showFpsBox)
  }

  render(){

    ctx.translate(this.x, this.y)

    ctx.fillStyle = "#555"
    ctx.fillRect(0, 0, 200, CANVAS_HEIGHT-20)

    ctx.textAlign = "center"
    ctx.fillStyle = "#b8b5b9"
    ctx.font = "36px bitPotionFont"


    ctx.drawImage(imgs.letterW, 75, 90, 50, 50)
    ctx.drawImage(imgs.letterA, 25, 140, 50, 50)
    ctx.drawImage(imgs.letterS, 75, 140, 50, 50)
    ctx.drawImage(imgs.letterD, 125, 140, 50, 50)

    ctx.fillText("To move around", 100, 210)

    ctx.drawImage(imgs.upArrow, 75, 230, 50, 50)
    ctx.drawImage(imgs.leftArrow, 25, 280, 50, 50)
    ctx.drawImage(imgs.downArrow, 75, 280, 50, 50)
    ctx.drawImage(imgs.rightArrow, 125, 280, 50, 50)


    ctx.fillText("To attack", 100, 350)

    ctx.drawImage(imgs.spaceBar, 25, 370, 150, 50)

    ctx.fillText("To dash", 100, 440)

    ctx.fillStyle = "#b8b5b9"
    ctx.font = "28px bitPotionFont"
    ctx.textAlign = "left"

    ctx.drawImage(showFps ? imgs.checkboxCheck : imgs.checkbox, 10, this.height-70, 40, 40)
    ctx.fillText("Show Fps Avg", 47, this.height-44)

    ctx.drawImage(freeCam ? imgs.checkboxCheck : imgs.checkbox, 10, this.height-40, 40, 40)
    ctx.fillText("Lock Camera", 47, this.height-14)

    super.render()

    // ctx.restore()
    // this.buttonBoxes[0].drawArea("yellow")
    // this.buttonBoxes[1].drawArea("yellow")
  }
}

export default ControlsInfoOverlay