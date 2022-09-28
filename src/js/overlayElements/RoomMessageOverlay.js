import OverlayElement from "./OverlayElement"
import {CANVAS_WIDTH, CANVAS_HEIGHT} from "../constants"
import Goblin from "../entities/Goblin"
import Chort from "../entities/Chort"


class RoomMessageOverlay extends OverlayElement{
  constructor(){
    super(CANVAS_WIDTH/2, CANVAS_HEIGHT-15, "Room Message Overlay", 1)
  }

  render(){
    ctx.translate(this.x, this.y)

    ctx.fillStyle = "#b8b5b9"
    ctx.textAlign = "center"
    ctx.font = "36px bitPotionFont"
    ctx.fillText(this.roomMessage(), 0, 0);

    super.render()
  }

  rareMessage() {
    let randomNum = activeRoom.randomNum
    if (randomNum >= 0 && randomNum < 0.01) return "**distant baby crying**"
    if (randomNum >= 0.01  && randomNum < 0.02) return "**tornado siren wailing**"
    if (randomNum >= 0.02  && randomNum < 0.03) return "**low whispers that sound like gen Z slang**"
    if (randomNum >= 0.03  && randomNum < 0.04) return "**crickets**"
    if (randomNum >= 0.04  && randomNum < 0.05) return "**sounds of being hopelessly lost**"
    if (randomNum >= 0.05  && randomNum < 0.06) return "**the sound of silence**"
    return null 
  }

  roomMessage(){
    // These are organized in priority, each condition overwrites the message
    let room = activeRoom
    let message = this.rareMessage() || ""
    if (room.torches.length > 0) message = "** torch crackling **"
    if (input.isDown('w') || input.isDown('d') || input.isDown('a') || input.isDown('s')) message = "** footsteps **"
    if (room.monsters.find(monster => monster instanceof Chort)) message = "** Chorts snickering **"
    if (room.monsters.find(monster => monster instanceof Goblin)) message = "** angry goblin noises **"
    if (room.monsters.find(monster => monster instanceof Goblin && monster.takingDamage)) message = "** angrier goblin noises **"
    if (room.chests.find(chest => chest.takingDamage)) message = "** wood splintering **" 
    if (room.monsters.find(monster => monster instanceof Chort && monster.isAgitated())) message = "** CHORTS SHRIEKING **"
    if (player.isFalling && Date.now() - player.fallTimer > 500) message = "** Niki screams as she tumbles into oblivion **"
    return message
  }
}

export default RoomMessageOverlay