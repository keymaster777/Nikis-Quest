import {TS, UP, LEFT, DOWN, RIGHT} from "./constants"
import Sprite from "./Sprite";
import DoorTile from "./tiles/DoorTile";
import BoundingElliptic from "./boundingAreas/BoundingElliptic"
import Killable from "./traits/Killable";
import Fightable from "./traits/Fightable";
import Movable from "./traits/Movable";

class Player{
  constructor(){
    this.x=50;
    this.y=0;

    this.spriteCoords = () => ({x: this.x-.65*TS, y: this.y-1*TS})
    this.sprite = new Sprite({
      coords: this.spriteCoords.bind(this),
      width: 256,
      height: 32,
      image: imgs.runLeft,
      numberOfFrames: 8,
      sizescale: .04,
    })

    this.boundaryCoords = () => ({x: this.x, y: this.y})
    this.boundary = new BoundingElliptic({
        coords: this.boundaryCoords.bind(this),
        xSemiAxis: .25*TS,
        ySemiAxis: .125*TS,
        isMovingBoundary: true,
    })

    this.hitBoxCoords = () => ({x: this.x, y: this.y-(.2*TS)})
    this.hitBox = new BoundingElliptic({
        coords: this.hitBoxCoords.bind(this),
        xSemiAxis: .3*TS,
        ySemiAxis: .15*TS,
        isMovingBoundary: true,
    })

    let killable = new Killable({
      maxHitPoints: 100,
      maxDamageFrames: 12,
      onDeath: () => window.location.reload(false) 
    })

    let fightable = new Fightable({
        attackDamage: 6,
        timeBetweenHits: 400,
        range: 30,
        weapon: imgs.woodSword
    })

    let movable = new Movable({
        speed: 2.5,
        dashSpeed: 7.5
    })

    this.idleImg = imgs.idleDown
    this.maxStamina = 100;
    this.stamina = this.maxStamina;
    this.enemiesFelled = 0
    this.chestsOpened = 0
    this.potionsConsumed = 0
    this.roomsExplored = 1

    // compose killable and fightable into player
    Object.assign(this, killable, fightable, movable)
  }

  attemptToDash(){
    let dashCost = 30;
    if(this.stamina >= dashCost) this.dash(() => {this.stamina -= dashCost})
  }

  canLeave(){
      return (Date.now() - activeRoom.roomTime > 1000);
  }

  setLocation(x,y){
      this.x=x;
      this.y=y;
  }

  setupMovements(){
    this.queuedMovements = []
    if(input.isDown('s')) this.queuedMovements.push(DOWN)
    if(input.isDown('w')) this.queuedMovements.push(UP)
    if(input.isDown('a')) this.queuedMovements.push(LEFT)
    if(input.isDown('d')) this.queuedMovements.push(RIGHT)
  }

  setSpriteImage(){
    if(this.queuedMovements.includes(UP)){
        this.sprite.image = imgs.runUp;
        this.idleImg = imgs.idleUp;
    }
    if(this.queuedMovements.includes(DOWN)){
        this.sprite.image = imgs.runDown;
        this.idleImg = imgs.idleDown;
    }
    if(this.queuedMovements.includes(LEFT)){
        this.sprite.image = imgs.runLeft;
        this.idleImg = imgs.idleLeft;
    }
    if(this.queuedMovements.includes(RIGHT)){
        this.sprite.image = imgs.runRight;
        this.idleImg = imgs.idleRight;
    }
    if(this.isAttacking){
        if(this.attackDirection == UP){
            this.sprite.image = imgs.runUp;
            this.idleImg = imgs.idleUp;
        }
        if(this.attackDirection == DOWN){
            this.sprite.image = imgs.runDown;
            this.idleImg = imgs.idleDown;
        }
        if(this.attackDirection == LEFT){
            this.sprite.image = imgs.runLeft;
            this.idleImg = imgs.idleLeft;
        }
        if(this.attackDirection == RIGHT){
            this.sprite.image = imgs.runRight;
            this.idleImg = imgs.idleRight;
        }
    }
  }

  draw(){
      this.setupMovements()
      this.setSpriteImage()

      if(input.isDown('SPACE') && this.isDashing == false) this.attemptToDash();

      if(this.isAttacking && this.attackDirection != DOWN) this.swingWeapon();

      if(this.isMoving()){
        this.move() 
        this.sprite.draw();
      } else {
        ctx.drawImage(this.idleImg, this.x-.65*TS, this.y-1*TS, TS*32*.04, TS*32*.04);
      }
      

      // this.boundary.drawBounds(activeRoom.boundaries(), 0, 0)
      

      if(this.isAttacking && this.attackDirection == DOWN) this.swingWeapon();

      if(this.takingDamage) this.damagedAnimation();
  }
}


export default Player