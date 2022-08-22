import {sprite} from "../helpers"
import {TS} from "../constants"
import Level from "../Level";

class Goblin{
  constructor(x, y){

    this.sprite = sprite({
        width: 64,
        height: 21,
        image: imgs.gnollShamanWalkRight,
        numberOfFrames: 4,
        sizescale: .045,
    });

    this.x=(x*TS)+.5*TS;
    this.y=(y*TS)+.5*TS;

    this.layer=1;
    this.isFacingRight = true;
    this.rlhitbox=.4*TS;
    this.bothitbox=1.15*TS;
    this.speed=Math.random() + .75;
    this.attackedLast = Date.now();
    this.attackDamage = 6+level.levelNum;
    this.hitPoints = 15;
    this.takingDamage = false;
    this.maxDamageFrames = 18;
  }
  
  move(){
    if (player.x < this.x-20) {
        this.sprite.image = imgs.gnollShamanWalkLeft;
        if(!this.outOfBounds(this.x - this.speed, this.y)) this.x -= this.speed;
    } else if (player.x > this.x+20) {
        this.sprite.image = imgs.gnollShamanWalkRight;
        if(!this.outOfBounds(this.x + this.speed, this.y)) this.x += this.speed;
    }

    if (player.y < this.y-20) {
        if(!this.outOfBounds(this.x, this.y - this.speed)) this.y -= this.speed;
    } else if (player.y > this.y+20) {
        if(!this.outOfBounds(this.x, this.y + this.speed)) this.y += this.speed;
    }

    if ( this.distanceToPlayer() < 30) this.attack(player);
  }

  distanceToPlayer(){
      return ((player.x-this.x)**2 + (player.y-this.y)**2)**.5
  }

  distanceToCoord(x1,y1){
      return ((x1-this.x)**2 + (y1-this.y)**2)**.5
  }

  attack(entity){
      if(Date.now() - this.attackedLast > 400){
          this.attackedLast = Date.now();
          entity.takeDamage(this.attackDamage);
      }
  }

  animations(){
      if(this.takingDamage) this.damageAnimation();
  }

  damageAnimation(){
      if(this.currentDamageFrame == this.maxDamageFrames){
          this.takingDamage = false;
      } else {
          this.currentDamageFrame % 2 == 0 ? this.sprite.xAdjust=-5 : this.sprite.xAdjust=5;
          this.currentDamageFrame++;
      }
  }

  takeDamage(damage){
      if(this.takingDamage) return;
      this.currentDamageFrame = 0
      this.hitPoints -= damage;
      if (this.hitPoints <= 0){
          activeRoom.monsters = activeRoom.monsters.filter(monster => monster != this)
          player.enemiesFelled += 1
      }
      this.takingDamage = true;
  }

  draw(debug){
      this.sprite.x = this.x-.35*TS;
      this.sprite.y = this.y-.85*TS;
      
      this.move();
      this.sprite.update();
      this.sprite.render();
      if (debug){
          ctx.fillStyle = "red";
          ctx.fillRect(this.x,this.y,5,5); // fill in the pixel at (10,10)
      }
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
}

export default Goblin
