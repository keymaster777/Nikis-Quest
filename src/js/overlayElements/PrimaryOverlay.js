import OverlayElement from "./OverlayElement"
import { CANVAS_HEIGHT, UP, DOWN, LEFT, RIGHT } from "../constants"
import Sprite from "../Sprite"

class PrimaryOverlay extends OverlayElement{
  constructor(){
    super(10, 10, "Primary Overlay", 1)

    this.mapPlayerSprite = new Sprite({
      width: 32,
      height: 32,
      image: imgs.runDown,
      numberOfFrames: 8,
      sizescale: .02,
    })

    this.mapMonsterSprite = new Sprite({
      width: 16,
      height: 21,
      image: imgs.gnollShamanWalkRight,
      numberOfFrames: 4,
      sizescale: .025,
    })

    this.coinSprite = new Sprite({
      width: 16,
      height: 16,
      image: imgs.coin,
      numberOfFrames: 4,
      sizescale: .035,
    })

    this.coinSprite.x = 78
    this.coinSprite.y = 110

  }

  render(){
    ctx.translate(this.x, this.y)

    // Container box
    ctx.fillStyle = "#555"
    ctx.fillRect(0, 0, 200, CANVAS_HEIGHT-20)

    this.coinSprite.draw()
    ctx.fillStyle = "#b8b5b9"
    ctx.font = "42px bitPotionFont"
    ctx.textAlign = "right"
    ctx.fillText(String(player.coins).padStart(7, "0"), 190, 102)
    ctx.textAlign = "left"
    ctx.fillText("COIN", 16, 102)

    ctx.drawImage(imgs.heart, 10, 10, 25, 25)

    ctx.fillStyle = "#111"
    ctx.fillRect(40, 10, 150, 25)

    ctx.fillStyle = "#5dBB63"
    ctx.font = "42px bitPotionFont"
    ctx.textAlign = "left"

    ctx.fillText("E", 17, 67)
    ctx.fillStyle = "#c03a47"
    ctx.fillRect(42, 12, 146*(player.hitPoints/player.maxHitPoints), 21)

    ctx.fillStyle = "#111"
    ctx.fillRect(40, 45, 150, 25)

    ctx.fillStyle = "#5dBB63"
    ctx.fillRect(42, 47, 146*(player.stamina/player.maxStamina), 21)



    this.drawMap(10, 130)

    ctx.fillStyle = "#b8b5b9"
    ctx.font = "28px bitPotionFont"

    ctx.fillText("LEVEL COMPLETION: ", 10, 345)

    ctx.drawImage(level.haveAllMonstersBeenKilled() ? imgs.checkboxCheck : imgs.checkbox, 10, 350, 40, 40)
    ctx.fillText("Clear all rooms", 45, 376)

    ctx.drawImage(level.isComplete() ? imgs.checkboxCheck : imgs.checkbox, 10, 380, 40, 40)
    ctx.fillText("Return to start" , 45, 406)

    ctx.textAlign = "center"
    ctx.font = "24px bitPotionFont"
    ctx.fillText(`Potions Devoured: ${player.potionsConsumed}`,100, CANVAS_HEIGHT-100)
    ctx.fillText(`Chests Opened: ${player.chestsOpened}`,100, CANVAS_HEIGHT-80)
    ctx.fillText(`Enemies Felled: ${player.enemiesFelled}`,100, CANVAS_HEIGHT-60)
    ctx.fillText(`Dungeon Level: ${level.levelNum}`,100, CANVAS_HEIGHT-30)

    super.render()
  }

  drawMap(x,y){
    ctx.fillStyle = "#1a1a1a"
    ctx.fillRect(x, y, 180, 180)
    this.mapMonsterSprite.update()

    let mapFirstX = activeRoom.x-2
    let mapFirstY = activeRoom.y-2

    for(let xi = 0; xi < 5; xi++){
      for(let yi = 0; yi < 5; yi++){
        let room = level.rooms.find(room => room.x === mapFirstX + xi && room.y === mapFirstY + yi)
        if(room && (room.visited || room.seen)){
          ctx.fillStyle = "#785c53"
          ctx.fillRect(xi*34+7+x, yi*34+7+y, 30, 30)

          ctx.fillStyle = "#f7f2ed"
          ctx.fillRect(xi*34+10+x, yi*34+10+y, 24, 24)

          room.doors.forEach(door => {
            let pathWidth, pathHeight, pathStart

            if(door.adjacentRoom.visited){
              if([UP, DOWN].includes(door.direction)){
                pathWidth = 6
                pathHeight = 7
                pathStart = { x: xi*34+19+x, y: door.direction === UP ? yi*34+3+y : yi*34+34+y }
              }
              if([LEFT, RIGHT].includes(door.direction)){
                pathWidth = 7
                pathHeight = 6
                pathStart = { x: (door.direction === LEFT ? xi*34+3+x : xi*34+34+x), y: yi*34+19+y }
              }
            } else {
              if([UP, DOWN].includes(door.direction)){
                pathWidth = 6
                pathHeight = 3
                pathStart = { x: xi*34+19+x, y: door.direction === UP ? yi*34+7+y : yi*34+34+y }

              }
              if([LEFT, RIGHT].includes(door.direction)){
                pathWidth = 3
                pathHeight = 6
                pathStart = { x: (door.direction === LEFT ? xi*34+7+x : xi*34+34+x), y: yi*34+19+y }
              }
            }
            ctx.fillRect(pathStart.x, pathStart.y, pathWidth, pathHeight)
          })

          if(room.x === 0 && room.y === 0) {
            ctx.fillStyle = "#785c53"
            ctx.fillRect(xi*34+19+x, yi*34+19+y, 6, 6)
          }

          if(room === activeRoom) {
            this.mapPlayerSprite.x = xi*34+x+22
            this.mapPlayerSprite.y = yi*34+y+35
            this.mapPlayerSprite.draw()
          }

          if (room !== activeRoom && room.monsters.length > 0) {
            this.mapMonsterSprite.x = xi*34+x+20
            this.mapMonsterSprite.y = yi*34+y+35
            this.mapMonsterSprite.render()
          }
        }
      }
    }
  }
}

export default PrimaryOverlay