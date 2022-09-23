import OverlayElement from "./OverlayElement"
import {CANVAS_HEIGHT} from "../constants"

class PrimaryOverlay extends OverlayElement{
  constructor(){
    super(10, 10, "Primary Overlay", 1)
  }

  render(){
    ctx.translate(this.x, this.y)

    // Container box
    ctx.fillStyle = "#555";
    ctx.fillRect(0, 0, 200, CANVAS_HEIGHT-20);

    ctx.drawImage(imgs.heart, 10, 10, 25, 25);

    ctx.fillStyle = "#111"
    ctx.fillRect(40, 10, 150, 25);

    ctx.fillStyle = "#5dBB63"
    ctx.font = "26px Arial";
    ctx.textAlign = "left"

    ctx.fillText("E", 13, 76);
    ctx.fillStyle = "#c03a47"
    ctx.fillRect(42, 12, 146*(player.hitPoints/player.maxHitPoints), 21);

    ctx.fillStyle = "#111"
    ctx.fillRect(40, 45, 150, 25);

    ctx.fillStyle = "#5dBB63"
    ctx.fillRect(42, 47, 146*(player.stamina/player.maxStamina), 21);

    level.drawMap(10, 95)

    level.drawCompletionCriteria(10, 310)

    ctx.fillStyle = "#b8b5b9"
    ctx.textAlign = "center"
    ctx.font = "16px Arial";
    ctx.fillText(`Dungeon Level: ${level.levelNum}`,100, CANVAS_HEIGHT-30);
    ctx.fillText(`Enemies Felled: ${player.enemiesFelled}`,100, CANVAS_HEIGHT-60);
    ctx.fillText(`Chests Opened: ${player.chestsOpened}`,100, CANVAS_HEIGHT-80);
    ctx.fillText(`Potions Devoured: ${player.potionsConsumed}`,100, CANVAS_HEIGHT-100);

    super.render()
  }
}

export default PrimaryOverlay