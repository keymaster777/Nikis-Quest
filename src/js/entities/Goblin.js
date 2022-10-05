import { TS, UP, DOWN, LEFT, RIGHT, NAMES } from "../constants"
import BoundingElliptic from "../boundingAreas/BoundingElliptic"
import BoundingRegion from "../boundingAreas/BoundingRegion"
import Sprite from "../Sprite"
import Killable from "../entityTraits/Killable"
import Fightable from "../entityTraits/Fightable"
import MovementBehavior from "../entityBehaviors/MovementBehavior"
import Potion from "./Potion"

class Goblin{
  constructor(tileSizeX, tileSizeY, spawnEmpowered = false){
    this.x=(tileSizeX*TS)+.5*TS
    this.y=(tileSizeY*TS)+.5*TS

    this.spriteCoords = () => ({ x: this.x, y: this.y+(.2*TS) })
    this.sprite = new Sprite({
      coords: this.spriteCoords.bind(this),
      width: 16,
      height: 21,
      image: imgs.gnollShamanWalkRight,
      numberOfFrames: 4,
      sizescale: .045,
    })

    this.boundaryCoords = () => ({ x: this.x, y: this.y })
    this.boundary = new BoundingElliptic({
      coords: this.boundaryCoords.bind(this),
      xSemiAxis: .25*TS,
      ySemiAxis: .125*TS,
      isMovingBoundary: true,
    })

    this.hitBoxCoords = () => ({ x: this.x, y: this.y-(.25*TS) })
    this.hitBox = new BoundingElliptic({
      coords: this.hitBoxCoords.bind(this),
      xSemiAxis: .3*TS,
      ySemiAxis: .15*TS,
      isMovingBoundary: true,
    })

    let killable = new Killable({
      maxHitPoints: 15,
      maxDamageFrames: 18,
      onDeath: this.killGoblin
    })

    let fightable = new Fightable({
      attackDamage: 6+level.levelNum,
      timeBetweenHits: 400,
      targets: (() => [player, ...activeRoom.chests])
    })

    let movementOptions = {
      speed: Math.random() + .75,
      maxKnockBackFrames: 10,
      knockBackInitialDistance: 16,
      dashSpeed: 6,
    }
    this.movementBehavior = new MovementBehavior(this, movementOptions)

    this.potionsConsumed = 0
    this.hasWings = false
    this.name = "Tony" // All average goblins are named Tony, this is common knowledge

    Object.assign(this, killable, fightable)
    if(spawnEmpowered || Math.random() < level.levelNum*.01) this.drinkPotion()
  }

  bodyCenter(){
    return { x: this.x, y: this.y-(.25*TS) }
  }

  drinkPotion(){
    overlayManager.addBossBarOverlay()
    this.powerUp()
    this.hitPoints = this.maxHitPoints
    this.potionsConsumed += 1
  }

  powerUp(){
    let movement = this.movementBehavior
    if(this.potionsConsumed === 0){
      this.name = NAMES.sort(() => 0.5 - Math.random())[0]
      this.multiplySize(2)
      this.maxHitPoints = this.maxHitPoints*5
      movement.speed += .5
      this.attackDamage += 4
      movement.maxKnockBackFrames = 4
      movement.knockBackInitialDistance = 6
    } else {
      movement.speed += .25
      this.attackDamage += 2
      this.maxHitPoints = Math.round(this.maxHitPoints*1.25)
    }
  }

  fullName(){
    let title = ""
    if(this.potionsConsumed === 1) title = "Super Goblin"
    if(this.potionsConsumed > 1) title = "Super Mega Goblin"
    return `${title} ${this.name}`
  }

  multiplySize(multiplier){
    this.sprite.sizescale *= multiplier
    this.sprite.yAdjust += (.2*TS)*multiplier-.2*TS
    this.boundary.multiplySize(multiplier)
    this.hitBox.multiplySize(multiplier)
  }

  killGoblin(){
    activeRoom.monsters = activeRoom.monsters.filter(monster => monster !== this)
    player.enemiesFelled += 1
    if(this.potionsConsumed > 0) {
      activeRoom.potions.push(new Potion(this.x-.5*TS, this.y-.2*TS, false))
    }
  }

  attemptToDash(){
    if(this.isDashing === false){
      let dy = player.bodyCenter().y - this.bodyCenter().y
      let dx = player.bodyCenter().x - this.bodyCenter().x
      let angleRadians = Math.atan2(dy, dx) // range (-PI, PI)
      let degrees = (angleRadians + Math.PI) * 180/Math.PI
      if(degrees >= 45 && degrees < 135) this.movementBehavior.startDashing(UP)
      if(degrees >= 135 && degrees < 225) this.movementBehavior.startCorrecting(RIGHT)
      if(degrees >= 225 && degrees < 315) this.movementBehavior.startCorrecting(DOWN)
      if(degrees < 45 || degrees >= 315) this.movementBehavior.startCorrecting(LEFT)
      this.movementBehavior.startDashing(this.facing)
    }
  }

  setSpriteImage(){
    if(this.facing === LEFT) this.sprite.image = imgs.gnollShamanWalkLeft
    if(this.facing === RIGHT) this.sprite.image = imgs.gnollShamanWalkRight
  }

  isAgitated(){
    if (this.boundary.boundaryCollisions(BoundingRegion.canBeFallenInto()).length > 0) return true
    return (this.potionsConsumed > 0 &&  Date.now() - this.damagedLast < 2000)
  }

  emote(){
    ctx.fillStyle = "red"
    ctx.textAlign = "center"
    if( this.isFalling){
      ctx.font = "36px antiquityFont"
      ctx.fillText("!", this.sprite.x, this.sprite.y - this.sprite.calculatedHeight()+10)
    } else if(this.isAgitated()){
      ctx.font = "26px antiquityFont"
      ctx.fillText(">:(", this.sprite.x, this.sprite.y - this.sprite.calculatedHeight())
    }
  }

  move(){
    this.walksRecklessly = this.isAgitated()
    this.movementBehavior.setupProximityMovements(player)
    this.setSpriteImage()
    this.movementBehavior.move()
  }

  draw(){

    if(this.potionsConsumed > 0 && this.isFalling && Date.now() - this.fallTimer > 400) this.attemptToDash()

    this.move()
    this.tryToAttackTargets()

    this.emote()
    this.sprite.draw()
    if(this.takingDamage) this.damagedAnimation()
  }
}

export default Goblin
