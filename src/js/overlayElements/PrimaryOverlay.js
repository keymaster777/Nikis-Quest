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
    ctx.font = "42px bitPotionFont"
    ctx.textAlign = "left"

    ctx.fillText("E", 17, 67);
    ctx.fillStyle = "#c03a47"
    ctx.fillRect(42, 12, 146*(player.hitPoints/player.maxHitPoints), 21);

    ctx.fillStyle = "#111"
    ctx.fillRect(40, 45, 150, 25);

    ctx.fillStyle = "#5dBB63"
    ctx.fillRect(42, 47, 146*(player.stamina/player.maxStamina), 21);

    level.drawMap(10, 95)

    ctx.fillStyle = "#b8b5b9"
    ctx.font = "28px bitPotionFont"

    ctx.fillText("LEVEL COMPLETION: ", 10, 310);

    ctx.drawImage(level.haveAllMonstersBeenKilled() ? imgs.checkboxCheck : imgs.checkbox, 10, 315, 40, 40);
    ctx.fillText("Clear all rooms", 45, 341);

    ctx.drawImage(level.isComplete() ? imgs.checkboxCheck : imgs.checkbox, 10, 345, 40, 40);
    ctx.fillText("Return to start" , 45, 371);

    ctx.textAlign = "center"
    ctx.font = "24px bitPotionFont"
    ctx.fillText(`Dungeon Level: ${level.levelNum}`,100, CANVAS_HEIGHT-30);
    ctx.fillText(`Enemies Felled: ${player.enemiesFelled}`,100, CANVAS_HEIGHT-60);
    ctx.fillText(`Chests Opened: ${player.chestsOpened}`,100, CANVAS_HEIGHT-80);
    ctx.fillText(`Potions Devoured: ${player.potionsConsumed}`,100, CANVAS_HEIGHT-100);

    super.render()
  }
}

export default PrimaryOverlay