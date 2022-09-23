import {TS, UP, DOWN, LEFT, RIGHT} from "../constants"
import BoundingElliptic from "../boundingAreas/BoundingElliptic";
import Sprite from "../Sprite";
import Killable from "../traits/Killable";
import Fightable from "../traits/Fightable";
import Movable from "../traits/Movable";

class Goblin{
  constructor(tileSizeX, tileSizeY){
    this.x=(tileSizeX*TS)+.5*TS;
    this.y=(tileSizeY*TS)+.5*TS;

    this.spriteCoords = () => ({x: this.x-.35*TS, y: this.y-.85*TS})
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

    this.hitBoxCoords = () => ({x: this.x, y: this.y-(.3*TS)})
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
    })

    let movable = new Movable({
        speed: Math.random() + .75,
        dashSpeedMultiplier: 1.5
    })

    // compose killable, fightable, movable into Goblin
    Object.assign(this, killable, fightable, movable)
  }
  
  killGoblin(){
    activeRoom.monsters = activeRoom.monsters.filter(monster => monster != this)
    player.enemiesFelled += 1
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

      if (this.canAttack(player)) this.attack(player)
      this.sprite.draw()
      if(this.takingDamage) this.damagedAnimation();
  }
}

export default Goblin
