import {TS, UP, DOWN, LEFT, RIGHT, NAMES} from "../constants"
import BoundingElliptic from "../boundingAreas/BoundingElliptic";
import Sprite from "../Sprite";
import Killable from "../entityTraits/Killable";
import Fightable from "../entityTraits/Fightable";
import Movable from "../entityTraits/Movable";
import Potion from "./Potion";

class Goblin{
  constructor(tileSizeX, tileSizeY, spawnEmpowered = false){
    this.x=(tileSizeX*TS)+.5*TS;
    this.y=(tileSizeY*TS)+.5*TS;

    this.spriteCoords = () => ({x: this.x, y: this.y+(.2*TS)})
    this.sprite = new Sprite({
      coords: this.spriteCoords.bind(this),
      width: 64,
      height: 21,
      image: imgs.gnollShamanWalkRight,
      numberOfFrames: 4,
      sizescale: .045,
    });

    this.boundaryCoords = () => ({x: this.x, y: this.y})
    this.boundary = new BoundingElliptic({
      coords: this.boundaryCoords.bind(this),
      xSemiAxis: .25*TS,
      ySemiAxis: .125*TS,
      isMovingBoundary: true,
    })

    this.hitBoxCoords = () => ({x: this.x, y: this.y-(.25*TS)})
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

    let movable = new Movable({
      speed: Math.random() + .75,
      dashSpeedMultiplier: 1.5,
    })

    this.potionsConsumed = 0
    this.hasWings = false
    this.name = "Tony" // All average goblins are named Tony, this is common knowledge

    // compose killable, fightable, movable into Goblin
    Object.assign(this, killable, fightable, movable)
    if(spawnEmpowered || Math.random() < level.levelNum*.01) this.drinkPotion() 
  }

  drinkPotion(){
    overlayManager.addBossBarOverlay()
    this.powerUp()
    this.hitPoints = this.maxHitPoints
    this.potionsConsumed += 1
  }

  powerUp(){
    if(this.potionsConsumed == 0){
      this.name = NAMES.sort(() => 0.5 - Math.random())[0]
      this.multiplySize(2)
      this.maxHitPoints = this.maxHitPoints*5
      this.speed += .5
      this.attackDamage += 4
      this.collisionTargets = (() => activeRoom.boundaries().filter(bound => bound.cancelsDash == true))
    } else {
      this.speed += .25
      this.attackDamage += 2
      this.maxHitPoints = Math.round(this.maxHitPoints*1.25)
    }
  }

  fullName(){
    let title = ""
    if(this.potionsConsumed == 1) title = "Super Goblin"
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
    activeRoom.monsters = activeRoom.monsters.filter(monster => monster != this)
    player.enemiesFelled += 1
    if(this.potionsConsumed > 0) {
      activeRoom.potions.push(new Potion(this.x-.5*TS, this.y-.2*TS, false))
    }
  }

  setupMovements(){
    if (player.y < this.y) this.queuedMovements.push(UP)
    if (player.y > this.y) this.queuedMovements.push(DOWN)
    if (player.x < this.x-5) this.queuedMovements.push(LEFT)
    if (player.x > this.x+5) this.queuedMovements.push(RIGHT)
  }

  setSpriteImage(){
    if(this.queuedMovements.includes(LEFT)) this.sprite.image = imgs.gnollShamanWalkLeft
    if(this.queuedMovements.includes(RIGHT)) this.sprite.image = imgs.gnollShamanWalkRight
  }

  draw(){
    this.setupMovements()
    this.setSpriteImage()
    this.move();
    this.tryToAttackTargets()

    this.sprite.draw()
    if(this.takingDamage) this.damagedAnimation();
  }
}

export default Goblin
