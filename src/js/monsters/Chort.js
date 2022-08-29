import {TS, UP, DOWN, LEFT, RIGHT} from "../constants"
import BoundingElliptic from "../boundingAreas/BoundingElliptic";
import { distance } from "../helpers";
import Sprite from "../Sprite";
import Killable from "../traits/Killable";
import Fightable from "../traits/Fightable";
import Movable from "../traits/Movable";

class Chort{
  constructor(tileSizeX, tileSizeY){
    this.x=(tileSizeX*TS)+.5*TS;
    this.y=(tileSizeY*TS)+.5*TS;

    this.spriteCoords = () => ({x: this.x-.35*TS, y: this.y-TS})
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

    this.hitBoxCoords = () => ({x: this.x, y: this.y-(.3*TS)})
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
        attackDamage: 8,
        timeBetweenHits: 400,
        // weapon: imgs.katana
    })

    let movable = new Movable({
        speed: 4+level.levelNum,
        dashSpeedMultiplier: 1.5
    })

    this.speed=4+level.levelNum;

    // compose killable and fightable into chort
    Object.assign(this, killable, fightable, movable)
  }
  
  move(){
    if ( this.takingDamage || (player.isMoving && distance(this.x, this.y, player.x, player.y) < 2.5*TS)) {
        let originalX = {...this}.x
        let originalY = {...this}.y

        this.isMoving = true

        if (player.x < this.x-5) {
            this.sprite.frameIndex = 0
            this.sprite.image = imgs.chortIdleLeft;
            this.x -= this.speed;
        } else if (player.x > this.x+5) {
            this.sprite.frameIndex = 3
            this.sprite.image = imgs.chortIdleRight;
            this.x += this.speed;
        }
        if(this.outOfBoundsNew()) this.x = originalX

        if (player.y < this.y) {
            this.y -= this.speed;
        } else if (player.y > this.y) {
            this.y += this.speed;
        }
        if(this.outOfBoundsNew()) this.y = originalY

    } else {
        this.isMoving = false
    }
    
    if (this.canAttack(player)) this.attack(player)
  }

  killChort(){
    activeRoom.monsters = activeRoom.monsters.filter(monster => monster != this)
    player.enemiesFelled += 1
  }

  setupMovements(){
    if ( this.takingDamage || distance(this.x, this.y, player.x, player.y) < 2*TS){
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

    if (this.canAttack(player)) this.attack(player)
    this.sprite.render();

    if(this.takingDamage) this.damagedAnimation();
  }
}

export default Chort
