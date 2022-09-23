import { distance } from "../helpers";
import {UP, DOWN, LEFT, RIGHT, TS} from "../constants"
import BoundingElliptic from "../boundingAreas/BoundingElliptic";
import Chest from "../tiles/Chest";

class Fightable{
  constructor(options){
    // General attributes
    this.attackDamage = options.attackDamage || 5;

    // Attributes for fightable without weapon
    this.timeBetweenHits = options.timeBetweenHits || 400 // milliseconds
    this.attackedLast = Date.now();

    // Attributes for fightable with weapon
    this.isAttacking = false
    this.weapon = options.weapon || null
    this.attackDirection = RIGHT;
    this.maxAttackFrame = options.maxAttackFrame || 100
    this.attackFrame = 0
    if(this.weapon) {
     this.weaponHitBoxArray = [...Array(6)].map((_, i) => {
      return new BoundingElliptic({
        coords: () => ({x: this.x, y: this.y}), //these get overwritten frequently
        xSemiAxis: 10,
        ySemiAxis: 10,
      })
     })
    }

    // Wrapping in methods for composition
    this.canAttack = this.canAttack
    this.attack = this.attack
    this.swingWeapon = this.swingWeapon
    this.attackSwingStartingPoint = this.attackSwingStartingPoint
  }

  canAttack(entity){
    let closeEnough = this.hitBox.boundaryCollisions([entity.hitBox]).length > 0
    let waitedLongEnough = Date.now() - this.attackedLast > this.timeBetweenHits

    return closeEnough && waitedLongEnough && this.isFalling != true
  } 

  attack(entity){
    this.attackedLast = Date.now();
    entity.takeDamage(this.attackDamage);
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

  swingWeapon(){
    // TODO clean up this whole method, jeez dude
    if(this.isFalling == true) return
    ctx.save();
    ctx.translate(this.x, this.y-.3*TS);
    ctx.rotate((this.attackSwingStartingPoint()+this.attackFrame)*Math.PI/180);
    ctx.drawImage(this.weapon, -.15*TS, -(TS+.25*TS), .35*TS, TS);
    ctx.restore();
    this.attackFrame+=6.5;

    let thirdAngle = 180-(90+this.attackSwingStartingPoint()+this.attackFrame);
    let Y = ((TS+TS*.25)/Math.sin(90 * Math.PI / 180))*Math.sin(thirdAngle * Math.PI / 180);
    let X = ((TS+TS*.25)/Math.sin(90 * Math.PI / 180))*Math.sin((this.attackSwingStartingPoint()+this.attackFrame) * Math.PI / 180);
    for(let i = 0; i<=5; i++) {
      this.weaponHitBoxArray.forEach(hitBox => {
        hitBox.coords = () => ({x: this.x+(.1*(i+4))*X, y: this.y-(.1*(i+4))*Y-.3*TS })
        // hitBox.drawArea("green")
      })

      activeRoom.monsters.forEach(monster => {
        if(monster.hitBox.boundaryCollisions(this.weaponHitBoxArray).length > 0) this.attack(monster)
      })

      activeRoom.torches.forEach(torch => {
        if(torch.hitBox.boundaryCollisions(this.weaponHitBoxArray).length > 0) this.attack(torch)
      })

      activeRoom.tileArray.filter(tile => tile.hitBox != undefined).forEach(tile => {
        if(tile.hitBox.boundaryCollisions(this.weaponHitBoxArray).length > 0) this.attack(tile)
      })
    }

    if(this.attackFrame >= this.maxAttackFrame) {
      this.attackFrame = 0;
      this.isAttacking = false;
    }
  }
}


export default Fightable