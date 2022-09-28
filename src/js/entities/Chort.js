import {TS, UP, DOWN, LEFT, RIGHT, NAMES} from "../constants"
import BoundingElliptic from "../boundingAreas/BoundingElliptic";
import { distance } from "../helpers";
import Sprite from "../Sprite";
import Killable from "../entityTraits/Killable";
import Fightable from "../entityTraits/Fightable";
import Movable from "../entityTraits/Movable";

class Chort{
  constructor(tileSizeX, tileSizeY){
    this.x=(tileSizeX*TS)+.5*TS;
    this.y=(tileSizeY*TS)+.5*TS;


    this.spriteCoords = () => ({x: this.x, y: this.y+(.2*TS)})
    this.sprite = new Sprite({
        coords: this.spriteCoords.bind(this),
        width: 64,
        height: 24,
        image: imgs.chortIdleLeft,
        numberOfFrames: 4,
        sizescale: .045,
    });

    this.boundaryCoords = () => ({x: this.x, y: this.y})
    this.boundary = new BoundingElliptic({
      coords: this.boundaryCoords.bind(this),
      xSemiAxis: .2*TS,
      ySemiAxis: .1*TS,
      isMovingBoundary: true,
    })

    this.hitBoxCoords = () => ({x: this.x, y: this.y-(.25*TS)})
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

    let movable = new Movable({
      speed: 3.5+level.levelNum*0.3,
      dashSpeedMultiplier: 1.5,
      speedDebuff: (() => this.hitPoints != this.maxHitPoints)
    })

    this.potionsConsumed = 0
    this.hasWings = false
    this.name = "Kyle" // All average Chorts are named Kyle, this is common knowledge

    // compose killable and fightable into chort
    Object.assign(this, killable, fightable, movable)
  }

  fightableTargets(){
    return [player]
  }

  drinkPotion(){
    overlayManager.addBossBarOverlay()
    this.powerUp()
    this.hitPoints = this.maxHitPoints
    this.potionsConsumed += 1
  }

  multiplySize(multiplier){
    this.sprite.sizescale *= multiplier
    this.sprite.yAdjust += (.2*TS)*multiplier-.2*TS
    this.boundary.multiplySize(multiplier)
    this.hitBox.multiplySize(multiplier)
  }

  powerUp(){
    if(this.potionsConsumed == 0){
      this.name = NAMES.sort(() => 0.5 - Math.random())[0]
      this.multiplySize(2)
      this.maxHitPoints = this.maxHitPoints*4
      this.collisionTargets = (() => activeRoom.boundaries().filter(bound => bound.cancelsDash == true))
    } else {
      this.maxHitPoints = Math.round(this.maxHitPoints*1.1)
    }
  }

  fullName(){
    let title = ""
    if(this.potionsConsumed == 1) title = "Super Chort"
    if(this.potionsConsumed > 1) title = "Super Mega Chort"
    return `${title} ${this.name}`
  }

  killChort(){
    activeRoom.monsters = activeRoom.monsters.filter(monster => monster != this)
    player.enemiesFelled += 1

    if(this.potionsConsumed > 0) {
      activeRoom.potions.push(new Potion(this.x-.5*TS, this.y-.2*TS, false))
    }
  }

  isAgitated(){
    return this.takingDamage || distance(this.x, this.y, player.x, player.y) < 2*TS
  }

  setupMovements(){
    if ( this.isAgitated()){
        if (player.y < this.y) this.queuedMovements.push(UP)
        if (player.y > this.y) this.queuedMovements.push(DOWN)
        if (player.x < this.x-5) this.queuedMovements.push(LEFT)
        if (player.x > this.x+5) this.queuedMovements.push(RIGHT)
    }
  }

  setSpriteImage(){
    if(this.queuedMovements.includes(LEFT)){
        this.sprite.image = imgs.chortIdleLeft
        this.sprite.frameIndex = 0
    } 
    if(this.queuedMovements.includes(RIGHT)){
        this.sprite.image = imgs.chortIdleRight
        this.sprite.frameIndex = 3
    }
  }


  draw(){
    this.setupMovements()
    this.setSpriteImage()

    if (this.queuedMovements.length == 0) this.sprite.update();

    this.move();
    this.tryToAttackTargets();
    this.sprite.render();

    if(this.takingDamage) this.damagedAnimation();
  }
}

export default Chort
