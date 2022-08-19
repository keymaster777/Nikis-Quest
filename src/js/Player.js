import {TS, UP, LEFT, DOWN, RIGHT} from "./constants"
import {sprite} from "./helpers"
import DoorTile2 from "./tiles/DoorTile2";
import Potion from "./tiles/Potion";
import Chest from "./tiles/Chest"
import Level from "./Level";

class Player{
  constructor(initialCoords){
    let player_sprite = sprite({
      width: 256,
      height: 32,
      image: imgs.runLeft,
      numberOfFrames: 8,
      sizescale: .04,
    })

    this.sprite = player_sprite;
    this.x=initialCoords.x;
    this.y=initialCoords.y;
    this.layer=1;
    this.rlhitbox=.4*TS;
    this.bothitbox=.15*TS;
    this.speed=TS*1.5;
    this.idle = imgs.idleDown
    this.weapon = imgs.katana
    this.dashedLast = Date.now();
    this.direction = DOWN;
    this.maxDashFrames = 10;
    this.maxDamageFrames = 12;
    this.maxHitPoints = 100;
    this.hitPoints = this.maxHitPoints;
    this.maxStamina = 100;
    this.stamina = this.maxStamina;
    this.takingDamage = false;
    this.attackDamage = 5;
    this.isAttacking = false;
    this.attackDirection = RIGHT;
    this.maxAttackFrame=100;
    this.lastLeftRoomTime = Date.now()
    this.isMoving = false;

    this.enemiesFelled = 0
    this.chestsOpened = 0
    this.potionsConsumed = 0
    this.roomsExplored = 1
  }
    
  move(dt, direction = false){
    this.isMoving = true
    let distance = this.speed*1.5*dt
    this.sprite.width = 256;
    this.sprite.numberOfFrames = 8;
    switch(direction){
        case DOWN:
            this.direction = DOWN;
            this.y+=this.isDashing ? distance*3 : distance;
            if(!this.isAttacking){
                this.sprite.image = imgs.runDown;
                this.idle = imgs.idleDown;
            }
            break;
        case UP:
            this.direction = UP;
            this.y-=this.isDashing ? distance*3 : distance;
            if(!this.isAttacking){
                this.sprite.image = imgs.runUp;
                this.idle = imgs.idleUp;
            }
            break;
        case LEFT:
            this.direction = LEFT;
            this.x-=this.isDashing ? distance*3 : distance;
            if(!this.isAttacking){
                this.sprite.image = imgs.runLeft;
                this.idle = imgs.idleLeft;
            } 
            break;
        case RIGHT:
            this.direction = RIGHT;
            this.x+=this.isDashing ? distance*3 : distance;
            if(!this.isAttacking){
                this.sprite.image = imgs.runRight;
                this.idle = imgs.idleRight;
            }
            break;
    }

    // Check if in potion area
    let potions = activeRoom.tileArray.filter(tile => tile instanceof Potion);
    potions.forEach((potion) => {
        if(potion.inArea(this.x, this.y) && this.hitPoints < this.maxHitPoints){
            activeRoom.tileArray = activeRoom.tileArray.filter(tile => tile != potion );
            this.potionsConsumed += 1
            this.hitPoints = Math.min(this.hitPoints + 20, this.maxHitPoints) 
        }
    })
  }

  dash(){
      let dashCost = 30;
      if(Date.now() - this.dashedLast > 500 && this.stamina >= dashCost){
          this.stamina -= dashCost
          this.dashedLast = Date.now();
          this.dashEndLocation = [0,0];
          this.currentDashFrame = 0;
          this.isDashing = true;
          switch(this.direction){
              case RIGHT:
                  this.dashEndLocation = player.getClosestValidSpot(player.x + 2.2*TS, player.y);
                  break;
              case LEFT:
                  this.dashEndLocation = player.getClosestValidSpot(player.x - 2.2*TS, player.y);
                  break;
              case UP:
                  this.dashEndLocation = player.getClosestValidSpot(player.x, player.y - 2.2*TS);
                  break;
              case DOWN:
                  this.dashEndLocation = player.getClosestValidSpot(player.x, player.y + 2.2*TS);
                  break;
          }
          this.rise = player.y-this.dashEndLocation["y"];
          this.run = player.x-this.dashEndLocation["x"];
      } 
  }
  dashDamage(){
      let closeMonsters = activeRoom.monsters.filter(monster => monster.distanceToPlayer() < 30);
      closeMonsters.forEach(monster => this.attack(monster));
  }
  attack(entity){
      entity.takeDamage(this.attackDamage);
  }
  animations(){
      if(this.isDashing) this.dashAnimation();
      if(this.takingDamage) this.damagedAnimation();
      
  }
  attackingAnimation(){
      ctx.save();
      ctx.translate(this.x, this.y-.3*TS);
      ctx.rotate((this.attackSwingStartingPoint()+this.attackFrame)*Math.PI/180);
      ctx.drawImage(this.weapon, -.15*TS, -(TS+.25*TS), .35*TS, TS);
      ctx.restore();
      this.attackFrame+=6.5;
      if(this.attackFrame >= this.maxAttackFrame) this.isAttacking = false;

      let thirdAngle = 180-(90+this.attackSwingStartingPoint()+this.attackFrame);
      let Y = ((TS+TS*.25)/Math.sin(90 * Math.PI / 180))*Math.sin(thirdAngle * Math.PI / 180);
      let X = ((TS+TS*.25)/Math.sin(90 * Math.PI / 180))*Math.sin((this.attackSwingStartingPoint()+this.attackFrame) * Math.PI / 180);
      for(let i = 1; i<10; i++) {
          // ctx.fillStyle = "red";
          // ctx.fillRect(this.x+((.1*i)*X),this.y-((.1*i)*Y)-(.3*TS),5,5);
          let closeMonsters = activeRoom.monsters.filter(monster => monster.distanceToCoord(this.x+(.1*i)*X, this.y-(.1*i)*Y-(.3*TS)) < 35);
          closeMonsters.forEach(monster => this.attack(monster));


          let closeChests = activeRoom.tileArray.filter(tile => tile instanceof Chest && tile.inArea(this.x+(.1*i)*X, this.y-(.1*i)*Y-(.3*TS)));
          closeChests.forEach(chest => this.attack(chest));
      }
  }
  strafeSprite(){
      switch(this.attackDirection){
          case UP:
              this.sprite.image = imgs.runUp;
              this.idle = imgs.idleUp;            
              break;
          case RIGHT:
              this.sprite.image = imgs.runRight;
              this.idle = imgs.idleRight;
              break;
          case DOWN:
              this.sprite.image = imgs.runDown;
              this.idle = imgs.idleDown;
              break;
          case LEFT:
              this.sprite.image = imgs.runLeft;
              this.idle = imgs.idleLeft;
              break;
      }
  }
  attackSwingStartingPoint(){
      switch(this.attackDirection){
          case UP:
              return -50;
          case RIGHT:
              return 40;
          case DOWN:
              return 130;
          case LEFT:
              return 220;
      }
  }
  dashAnimation(){
      if(this.currentDashFrame == this.maxDashFrames){
          player.moveToClosestValidSpot();
          this.isDashing = false;
      } else {
          player.x -= this.run/this.maxDashFrames;
          player.y -= this.rise/this.maxDashFrames;
          this.dashDamage();
          this.currentDashFrame++;
      }
  }
  damagedAnimation(){
      if(this.currentDamageFrame == this.maxDamageFrames){
          this.takingDamage = false;
      } else {
          this.currentDamageFrame % 2 == 0 ? this.sprite.xAdjust=-5 : this.sprite.xAdjust=5;
          this.currentDamageFrame++;
      }
  }
  moveToClosestValidSpot(){
      let closestLocation = player.getClosestValidSpot(player.x, player.y);
      player.x=closestLocation["x"];
      player.y=closestLocation["y"];
  }
  getClosestValidSpot(x, y){
      let closestLocation = {x: x, y: y};
      for( let i = 0; player.outOfBounds(closestLocation["x"], closestLocation["y"]); i+=5){
          if(!player.outOfBounds(x-i, y)) closestLocation["x"]=x-i;
          else if(!player.outOfBounds(x-i*.5, y-i*.5)) closestLocation={x: x-i*.5, y: y-i*.5};
          else if(!player.outOfBounds(x, y+i)) closestLocation["y"]=y+i;
          else if(!player.outOfBounds(x+i*.5, y-i*.5)) closestLocation={x: x+i*.5, y: y-i*.5};
          else if(!player.outOfBounds(x+i, y)) closestLocation["x"]=x+i;
          else if(!player.outOfBounds(x+i*.5, y+i*.5)) closestLocation={x: x+i*.5, y: y+i*.5};
          else if(!player.outOfBounds(x, y-i)) closestLocation["y"]=y-i;
          else if(!player.outOfBounds(x-i*.5, y+i*.5)) closestLocation={x: x-i*.5, y: y+i*.5};
      }
      return closestLocation;
  }

  takeDamage(damage){
      if(this.takingDamage || this.isDashing) return;
      this.currentDamageFrame = 0
      this.hitPoints -= damage;
      if (this.hitPoints <= 0) window.location.reload(false);
      this.takingDamage = true;
  }

  spriteIdle(){
      this.sprite.width = 32
      this.sprite.numberOfFrames = 1;
      this.sprite.image = this.idle;
  }

  canLeave(){
      return (Date.now() - activeRoom.roomTime > 1000);
  }

  draw(debug){
      if (this.isDashing || this.takingDamage) ctx.globalAlpha = 0.6;
      if(debug){this.speed = 3*TS;}
      debug = debug || false;
      this.sprite.x = this.x-.65*TS;
      this.sprite.y = this.y-1*TS;

      if(this.isAttacking) this.strafeSprite();

      if(this.isAttacking && this.attackDirection != DOWN) this.attackingAnimation();


      this.sprite.update();
      this.sprite.render();

      if(this.isMoving == false) this.spriteIdle();

      if(this.isAttacking && this.attackDirection == DOWN) this.attackingAnimation();
      
      if (debug){
          ctx.fillStyle = "red";
          ctx.fillRect(this.x,this.y,5,5); // fill in the pixel at (10,10)
      }
      ctx.globalAlpha = 1;
  }

  setLocation(x,y){
      this.x=x;
      this.y=y;
  }

  outOfBounds(x,y){
      let obstructing = activeRoom.tileArray.filter(tile => tile.obstructing == true);
      let list = [];
      for (var it = x -this.rlhitbox; it <= x+this.rlhitbox; it++) {
          list.push(it);
      }
      for(var i = 0;i<obstructing.length;i++){
          for(var i2 = 0; i2<list.length;i2++){
              if( obstructing[i].inArea(list[i2], y)){
                  return true;
              }
          }
      }
      if(( y<TS || y>(activeRoom.height+1)*TS)||(x>(activeRoom.width)*TS)||x<0){
          return true;
      }
  }

  atDoor(){
      var doors=activeRoom.tileArray.filter(tile => tile instanceof DoorTile2);
      for(var i = 0;i<doors.length;i++){
          if( doors[i].inArea(this.x,this.y)){
              if(
                  player.outOfBounds(player.x-3, player.y) ||
                  player.outOfBounds(player.x+3, player.y) ||
                  player.outOfBounds(player.x, player.y-3) ||
                  player.outOfBounds(player.x, player.y+3)
              ) return true;
          }
      }
  }
}


export default Player