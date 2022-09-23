import OverlayElement from "./OverlayElement"
import {CANVAS_HEIGHT, CANVAS_WIDTH} from "../constants"

class DarkRoomOverlay extends OverlayElement{
  constructor(){
    super(0, 0, "Dark Room Overlay", 2)
  }

  tearDownConditions(){
    return activeRoom.torches.length > 0 
  }

  elementTeardown(){
    super.elementTeardown()
  }

  render(){
    ctx.translate(this.x, this.y)

    ctx.fillStyle = "#111";
    ctx.globalAlpha = 0.5
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); 
    ctx.globalAlpha = 1.0 

    super.render()
  }
}

export default DarkRoomOverlay