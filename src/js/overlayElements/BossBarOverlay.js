import OverlayElement from "./OverlayElement"
import { CANVAS_WIDTH } from "../constants"

class BossBarOverlay extends OverlayElement{
  constructor(){
    super(250, 15, "Boss Bar Overlay", 1)
    this.width = CANVAS_WIDTH-500
  }

  tearDownConditions(){
    let potentialBossMobs = [...activeRoom.monsters, ...activeRoom.chests]
    return potentialBossMobs.find(monster => monster.potionsConsumed > 0) === undefined
  }

  render(){
    let potentialBossMobs = [...activeRoom.monsters, ...activeRoom.chests]
    this.bosses = potentialBossMobs.filter(monster => monster.potionsConsumed > 0)
    this.barHeight = 34
    this.height = this.bosses.length*this.barHeight

    ctx.translate(this.x, this.y)

    ctx.fillStyle = "#555"
    ctx.globalAlpha = 0.75
    ctx.fillRect(0, 0, this.width, this.height)
    ctx.globalAlpha = 1.0

    this.bosses.forEach((boss, index) => {
      this.renderBossBar(boss, index*this.barHeight)
    })

    super.render()
  }

  renderBossBar(boss, yStart){
    ctx.fillStyle = "#111"
    ctx.fillRect(5, yStart+3, this.width-10, this.barHeight-6)

    ctx.fillStyle = "#c03a47"
    ctx.fillRect(7, yStart+5, (this.width-14)*(boss.hitPoints/boss.maxHitPoints), this.barHeight-10)

    ctx.textAlign = "left"
    ctx.fillStyle = "#ddd"
    ctx.font = "32px bitPotionFont"
    ctx.fillText(`Mini Boss - ${boss.fullName()}`, 15, yStart+23)

    ctx.textAlign = "right"
    ctx.fillText(`${boss.hitPoints}/${boss.maxHitPoints}`, this.width-15, yStart+23)
  }
}

export default BossBarOverlay