import OverlayElement from "./OverlayElement"
import {CANVAS_WIDTH, CANVAS_HEIGHT} from "../constants"
import Player from "../Player"

class LevelStartOverlay extends OverlayElement{
  constructor(){
    super(250, CANVAS_HEIGHT-150, "Level Start Overlay", 1)
    this.width = CANVAS_WIDTH-500
    this.height = 80
  }

  tearDownConditions(){
    return activeRoom.x != 0 || activeRoom.y != 0
  }

  render(){
    ctx.translate(this.x, this.y)

    ctx.fillStyle = "#111";
    ctx.globalAlpha = 0.75
    ctx.fillRect(0, 0, this.width, this.height); 
    ctx.globalAlpha = 1.0 

    ctx.fillStyle = "#ddd";
    ctx.font = "20px Arial"

    if (player.hitPoints == 0) {
      ctx.fillText("You died in the first room... way to ruin the vibe.", this.width/2, 45)
    } else {
      ctx.fillText("LEAVE THIS ROOM THROUGH ONE OF THE 4 DOORS.", this.width/2, 45)
    } 

    super.render()
  }
}

export default LevelStartOverlay