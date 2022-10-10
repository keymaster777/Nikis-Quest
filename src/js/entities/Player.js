import { TS, UP, LEFT, DOWN, RIGHT } from "../constants"
import Sprite from "../Sprite"
import BoundingElliptic from "../boundingAreas/BoundingElliptic"
import Killable from "../entityTraits/Killable"
import Fightable from "../entityTraits/Fightable"
import MovementBehavior from "../entityBehaviors/MovementBehavior"

class Player{
  constructor(){
    this.x=50
    this.y=0

    this.spriteCoords = () => ({ x: this.x, y: this.y+(.3*TS) })
    this.sprite = new Sprite({
      coords: this.spriteCoords.bind(this),
      width: 32,
      height: 32,
      image: imgs.runLeft,
      numberOfFrames: 8,
      sizescale: .04,
    })

    this.boundaryCoords = () => ({ x: this.x, y: this.y })
    this.boundary = new BoundingElliptic({
      coords: this.boundaryCoords.bind(this),
      xSemiAxis: .3*TS,
      ySemiAxis: .15*TS,
      isMovingBoundary: true,
    })

    this.hitBoxCoords = () => ({ x: this.x, y: this.y-(.2*TS) })
    this.hitBox = new BoundingElliptic({
      coords: this.hitBoxCoords.bind(this),
      xSemiAxis: .4*TS,
      ySemiAxis: .2*TS,
      isMovingBoundary: true,
    })

    let killable = new Killable({
      maxHitPoints: 100,
      maxDamageFrames: 12,
      onDeath: this.killPlayer
    })

    let fightable = new Fightable({
      attackDamage: 6,
      timeBetweenHits: 400,
      range: 30,
      weapon: imgs.woodSword,
    })

    this.walksSlowInDark = true
    this.cantBeShoved = true

    let movementOptions = {
      speed: 2.5,
      dashSpeed: 11,
      canBeKnockedBack: false,
    }
    this.movementBehavior = new MovementBehavior(this, movementOptions)

    this.idleImg = imgs.idleDown
    this.maxStamina = 100
    this.stamina = this.maxStamina
    this.enemiesFelled = 0
    this.chestsOpened = 0
    this.potionsConsumed = 0
    this.roomsExplored = 1
    this.coins = 0

    // compose killable and fightable into player
    Object.assign(this, killable, fightable)
  }

  killPlayer(){
    this.movementBehavior.disabledMovement = true
    overlayManager.addYouDiedOverlay()
  }

  bodyCenter(){
    return { x: this.x, y: this.y-(.2*TS) }
  }

  drinkPotion(){
    this.potionsConsumed += 1
    this.hitPoints = Math.min(this.hitPoints + 20, this.maxHitPoints)
    this.lastDrankPotion = Date.now()
  }

  attemptToDash(){
    let dashCost = 30
    if( this.stamina >= dashCost && this.movementBehavior.startDashing()) this.stamina -= dashCost
  }

  setLocation(coord){
    this.x=coord.x
    this.y=coord.y
  }

  setSpriteImage(){
    if(this.movementBehavior.isMoving()){
      this.sprite.numberOfFrames = 8
      if(this.facing === RIGHT) this.sprite.image = imgs.runRight
      if(this.facing === LEFT) this.sprite.image = imgs.runLeft
      if(this.facing === UP) this.sprite.image = imgs.runUp
      if(this.facing === DOWN) this.sprite.image = imgs.runDown
    } else {
      this.sprite.numberOfFrames = 1
      if(this.facing === RIGHT) this.sprite.image = imgs.idleRight
      if(this.facing === LEFT) this.sprite.image = imgs.idleLeft
      if(this.facing === UP) this.sprite.image = imgs.idleUp
      if(this.facing === DOWN) this.sprite.image = imgs.idleDown
    }
  }

  isAgitated(){
    return this.hitPoints < this.maxHitPoints && Date.now() - this.damagedLast < 1500
  }

  emote(){
    ctx.save()

    ctx.fillStyle = "red"
    ctx.textAlign = "center"
    if( this.isFalling){
      ctx.font = "36px antiquityFont"
      ctx.fillText("!", this.sprite.x, this.sprite.y - this.sprite.calculatedHeight()+10)
    } else if(this.isAgitated()){
      ctx.font = "15px antiquityFont"
      ctx.fillText(">:(", this.sprite.x, this.sprite.y - this.sprite.calculatedHeight()+10)
    } else if(this.potionsConsumed > 0 && Date.now() - this.lastDrankPotion < 1500){
      ctx.font = "20px arial"
      ctx.fillText("ヽ(^o^)ノ", this.sprite.x, this.sprite.y - this.sprite.calculatedHeight()+10)
    }

    ctx.restore()
  }

  move(){
    this.movementBehavior.setupInputMovements()
    this.setSpriteImage()
    this.movementBehavior.move()
  }

  draw(){
    if(input.isDown("SPACE")) this.attemptToDash()

    if(this.hitPoints > 0 && this.isAttacking && this.attackDirection !== DOWN) this.swingWeapon()

    if(this.hitPoints === 0) ctx.globalAlpha = 0
    if (this.stamina < 100) this.stamina += 0.35

    this.move()
    this.emote()
    this.sprite.draw()

    ctx.globalAlpha = 1

    if(this.hitPoints > 0 && this.isAttacking && this.attackDirection === DOWN) this.swingWeapon()

    if(this.takingDamage) this.damagedAnimation()
  }
}

export default Player