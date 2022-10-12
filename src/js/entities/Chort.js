import { TS, LEFT, RIGHT, NAMES } from "../constants"
import BoundingElliptic from "../boundingAreas/BoundingElliptic"
import { distance } from "../helpers"
import Sprite from "../Sprite"
import Killable from "../entityTraits/Killable"
import Fightable from "../entityTraits/Fightable"
import MovementBehavior from "../entityBehaviors/MovementBehavior"
import Potion from "./Potion"
import Coin from "./Coin"

class Chort{
  constructor(tileSizeX, tileSizeY){
    this.x=(tileSizeX*TS)+.5*TS
    this.y=(tileSizeY*TS)+.5*TS


    this.spriteCoords = () => ({ x: this.x, y: this.y+(.2*TS) })
    this.sprite = new Sprite({
      coords: this.spriteCoords.bind(this),
      width: 16,
      height: 24,
      image: imgs.chortIdleLeft,
      numberOfFrames: 4,
      sizescale: .045,
    })

    this.boundaryCoords = () => ({ x: this.x, y: this.y })
    this.boundary = new BoundingElliptic({
      coords: this.boundaryCoords.bind(this),
      xSemiAxis: .2*TS,
      ySemiAxis: .1*TS,
      isMovingBoundary: true,
      entityBound: true,
    })

    this.hitBoxCoords = () => ({ x: this.x, y: this.y-(.25*TS) })
    this.hitBox = new BoundingElliptic({
      coords: this.hitBoxCoords.bind(this),
      xSemiAxis: .25*TS,
      ySemiAxis: .125*TS,
      isMovingBoundary: true,
    })

    let killable = new Killable({
      maxHitPoints: 10,
      maxDamageFrames: 18,
      onDeath: this.killChort
    })

    let fightable = new Fightable({
      attackDamage: 10,
      timeBetweenHits: 400,
      targets: (() => [player, ...activeRoom.chests])
    })

    this.walksRecklessly = true
    let movementOptions = {
      speed: 3.75+level.levelNum*0.3,
      maxKnockBackFrames: 8,
      knockBackInitialDistance: 16,
      dashSpeed: 10,
    }
    this.movementBehavior = new MovementBehavior(this, movementOptions)

    this.potionsConsumed = 0
    this.hasWings = false
    this.name = "Kyle" // All average Chorts are named Kyle, this is common knowledge

    // compose killable and fightable into chort
    Object.assign(this, killable, fightable)
  }

  bodyCenter(){
    return { x: this.x, y: this.y-(.25*TS) }
  }

  fightableTargets(){
    return [player]
  }

  drinkPotion(){
    overlayManager.addBossBarOverlay()
    this.powerUp()
    this.hitPoints = this.maxHitPoints
    this.potionsConsumed += 1
    this.lastDrankPotion = Date.now()
  }

  multiplySize(multiplier){
    this.sprite.sizescale *= multiplier
    this.sprite.yAdjust += (.2*TS)*multiplier-.2*TS
    this.boundary.multiplySize(multiplier)
    this.hitBox.multiplySize(multiplier)
  }

  powerUp(){
    if(this.potionsConsumed === 0){
      this.name = NAMES.sort(() => 0.5 - Math.random())[0]
      this.multiplySize(2)
      this.maxHitPoints = this.maxHitPoints*4
      this.maxKnockBackFrames = 4
      this.knockBackInitialDistance = 8
    } else {
      this.maxHitPoints = Math.round(this.maxHitPoints*1.1)
    }
  }

  fullName(){
    let title = ""
    if(this.potionsConsumed === 1) title = "Super Chort"
    if(this.potionsConsumed > 1) title = "Super Mega Chort"
    return `${title} ${this.name}`
  }

  killChort(){
    activeRoom.monsters = activeRoom.monsters.filter(monster => monster !== this)
    player.enemiesFelled += 1;

    [...Array(5)].forEach(() => {
      let coin = new Coin(this.x, this.y)
      if(this.isFalling === false) player.knockBack(coin)
      activeRoom.coins.push(coin)
    })

    if(this.potionsConsumed > 0){
      [...Array(2)].forEach(() => {
        let coin = new Coin(this.x, this.y, { value: 10 })
        if(this.isFalling === false) player.knockBack(coin)
        activeRoom.coins.push(coin)
      });

      [...Array(this.potionsConsumed)].forEach(() => {
        activeRoom.potions.push(new Potion(
          this.x-.5*TS+(Math.random()*30)-15,
          this.y-.2*TS+(Math.random()*30)-15,
          false
        ))
      })
    }
  }

  isAgitated(){
    return this.takingDamage || distance(this.x, this.y, player.x, player.y) < 2*TS
  }

  setSpriteImage(){
    if(this.movementBehavior.isMoving()){
      if(this.facing === LEFT){
        this.sprite.image = imgs.chortIdleLeft
        this.sprite.frameIndex = 0
      }
      if(this.facing === RIGHT){
        this.sprite.image = imgs.chortIdleRight
        this.sprite.frameIndex = 3
      }
    }
  }

  emote(){
    ctx.fillStyle = "red"
    ctx.textAlign = "center"

    if( this.isFalling){
      ctx.font = "36px antiquityFont"
      ctx.fillText("!", this.sprite.x, this.sprite.y - this.sprite.calculatedHeight()+10)
    } else if(this.isAgitated()){
      ctx.font = "15px antiquityFont"
      ctx.fillText(">:(", this.sprite.x, this.sprite.y - this.sprite.calculatedHeight()+10)
    } else if(Date.now() - this.lastDrankPotion < 1500){
      ctx.font = "20px arial"
      ctx.fillText("ヽ(^o^)ノ", this.sprite.x, this.sprite.y - this.sprite.calculatedHeight()+10)
    }
  }

  attemptToDash(){
    if(this.isDashing === false) this.movementBehavior.startDashing()
  }

  move(){
    this.walksRecklessly = this.hitPoints < this.maxHitPoints
    if(this.isAgitated()) this.movementBehavior.setupProximityMovements(player)
    this.setSpriteImage()
    this.movementBehavior.move()
  }

  draw(){
    if (this.movementBehavior.queuedMovements.length === 0) this.sprite.update()
    if(this.potionsConsumed > 0 && this.isFalling && Date.now() - this.fallTimer > 400) this.attemptToDash()

    this.move()
    this.tryToAttackTargets()
    this.emote()
    this.sprite.render()

    if(this.takingDamage) this.damagedAnimation()
  }
}

export default Chort
