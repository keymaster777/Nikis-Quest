class Killable{
  constructor(options){
    this.maxDamageFrames = options.maxDamageFrames || 10
    this.maxHitPoints = options.maxHitPoints || 10
    this.onDeath = options.onDeath || (() => console.log("Entity has died."))

    this.hitPoints = this.maxHitPoints
    this.takingDamage = false
    this.damagedLast = Date.now()
    this.damagedAnimation = this.damagedAnimation
    this.takeDamage = this.takeDamage
  }

  damagedAnimation(){
    if(this.currentDamageFrame === this.maxDamageFrames){
      if(this.sprite) this.sprite.xAdjust = 0
      this.takingDamage = false
    } else {
      if(this.sprite === undefined){
        this.currentDamageFrame % 2 === 0 ? this.x-=5 : this.x+=5
      } else {
        this.currentDamageFrame % 2 === 0 ? this.sprite.xAdjust=-5 : this.sprite.xAdjust=5
      }
      this.currentDamageFrame++
    }
  }

  takeDamage(damage){
    if(this.takingDamage || this.isDashing) return
    this.damagedLast = Date.now()
    this.takingDamage = true
    this.currentDamageFrame = 0
    this.hitPoints = Math.max(0, this.hitPoints-damage)

    if (this.hitPoints === 0) this.onDeath()
  }
}


export default Killable