import { TS, LEFT, RIGHT, NAMES } from "../constants"
import BoundingElliptic from "../boundingAreas/BoundingElliptic"
import Sprite from "../Sprite"
import Killable from "../entityTraits/Killable"
import Fightable from "../entityTraits/Fightable"
import MovementBehavior from "../entityBehaviors/MovementBehavior"
import Potion from "./Potion"
import Coin from "./Coin"

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
      entityBound: true,
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
      speed: Math.random() + .9,
      maxKnockBackFrames: 10,
      knockBackInitialDistance: 16,
      dashSpeed: 8,
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
    this.lastDrankPotion = Date.now()
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
    player.enemiesFelled += 1;

    [...Array(3)].forEach(() => {
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

  attemptToDash(){
    if(this.isDashing === false) this.movementBehavior.startDashing()
  }

  setSpriteImage(){
    if(this.facing === LEFT) this.sprite.image = imgs.gnollShamanWalkLeft
    if(this.facing === RIGHT) this.sprite.image = imgs.gnollShamanWalkRight
  }

  isAgitated(){
    let isSuper = this.potionsConsumed > 0
    let damagedRecently = Date.now() - this.damagedLast < 2000
    return isSuper && (damagedRecently || this.isFalling)
  }

  emote(){
    ctx.fillStyle = "red"
    ctx.textAlign = "center"
    if( this.isFalling){
      ctx.font = "36px antiquityFont"
      ctx.fillText("!", this.sprite.x, this.sprite.y - this.sprite.calculatedHeight()+10)
    } else if(this.isAgitated()){
      ctx.font = "26px antiquityFont"
      ctx.fillText(">:(", this.sprite.x, this.sprite.y - this.sprite.calculatedHeight()+10)
    } else if(Date.now() - this.lastDrankPotion < 1500){
      ctx.font = "20px arial"
      ctx.fillText("ヽ(^o^)ノ", this.sprite.x, this.sprite.y - this.sprite.calculatedHeight()+10)
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
