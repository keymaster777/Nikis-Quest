import { UP, DOWN, LEFT, RIGHT, TS } from "../constants"
import BoundingElliptic from "../boundingAreas/BoundingElliptic"

class Fightable{
  constructor(options){
    // General attributes
    this.attackDamage = options.attackDamage || 5
    this.targets = options.targets || this.fightableTargets

    // Attributes for fightable without weapon
    this.timeBetweenHits = options.timeBetweenHits || 400 // milliseconds
    this.attackedLast = Date.now()

    // Attributes for fightable with weapon
    this.isAttacking = false
    this.weapon = options.weapon || null
    this.maxAttackFrame = options.maxAttackFrame || 100
    this.attackFrame = 0
    if(this.weapon) {
      this.weaponHitBoxArray = [...Array(6)].map(() => {
        return new BoundingElliptic({
          coords: () => ({ x: this.x, y: this.y }), //these get overwritten frequently
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
    this.tryToAttackTargets = this.tryToAttackTargets
    this.knockBack = this.knockBack
  }

  fightableTargets(){
    return activeRoom.hitBoxEntities()
  }

  canAttack(entity){
    let closeEnough = this.hitBox.boundaryCollisions([entity.hitBox]).length > 0
    let waitedLongEnough = Date.now() - this.attackedLast > this.timeBetweenHits

    return closeEnough && waitedLongEnough && this.isFalling !== true
  }

  attack(entity){
    this.attackedLast = Date.now()
    if(entity?.movementBehavior?.canBeKnockedBack === true && entity.takingDamage === false) this.knockBack(entity)
    entity.takeDamage(this.attackDamage)
  }

  knockBack(entity){
    let dy = entity.bodyCenter().y - this.bodyCenter().y
    let dx = entity.bodyCenter().x - this.bodyCenter().x
    let angleRadians = Math.atan2(dy, dx) // range (-PI, PI)

    if(entity.movementBehavior !== undefined){
      entity.movementBehavior.startKnockBack(angleRadians)
    }
  }

  tryToAttackTargets(){
    this.targets().forEach(target => {
      if(this.canAttack(target)) this.attack(target)
    })
  }

  attackSwingStartingPoint(){
    switch(this.facing){
    case UP:
      return -50
    case RIGHT:
      return 40
    case DOWN:
      return 130
    case LEFT:
      return 220
    }
  }

  swingWeapon(){
    // TODO clean up this whole method, jeez dude
    if(this.isFalling === true) return
    ctx.save()
    ctx.translate(this.x, this.y-.3*TS)
    ctx.rotate((this.attackSwingStartingPoint()+this.attackFrame)*Math.PI/180)
    ctx.drawImage(this.weapon, -.15*TS, -(TS+.25*TS), .35*TS, TS)
    ctx.restore()
    this.attackFrame+=6.5

    let thirdAngle = 180-(90+this.attackSwingStartingPoint()+this.attackFrame)
    let Y = ((TS+TS*.25)/Math.sin(90 * Math.PI / 180))*Math.sin(thirdAngle * Math.PI / 180)
    let X = ((TS+TS*.25)/Math.sin(90 * Math.PI / 180))*Math.sin((this.attackSwingStartingPoint()+this.attackFrame) * Math.PI / 180)
    for(let i = 0; i<=5; i++) {
      this.weaponHitBoxArray.forEach(hitBox => {
        hitBox.coords = () => ({ x: this.x+(.1*(i+4))*X, y: this.y-(.1*(i+4))*Y-.3*TS })
        // hitBox.drawArea("green")
      })

      this.targets().forEach(target => {
        if(this === target) return // Dont try to attack self
        if(target.hitBox.boundaryCollisions(this.weaponHitBoxArray).length > 0) this.attack(target)
      })
    }

    if(this.attackFrame >= this.maxAttackFrame) {
      this.attackFrame = 0
      this.isAttacking = false
    }
  }
}


export default Fightable