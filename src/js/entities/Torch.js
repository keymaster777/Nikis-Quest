import { TS } from "../constants"
import BoundingElliptic from "../boundingAreas/BoundingElliptic"
import Sprite from "../Sprite"
import Killable from "../entityTraits/Killable"

class Torch{
  constructor(tileSizeX, tileSizeY, options={}){
    this.x = tileSizeX*TS + (options.xAdjust || 0)
    this.y = tileSizeY*TS + (options.yAdjust || 0)
    this.depthBreakpoint = this.y + .85*TS + (options.depthAdjust || 0)

    let torchSprite = new Sprite({
      x: this.x+.5*TS,
      y: this.y+(.7*TS),
      width: 64,
      height: 16,
      image: imgs.torch,
      numberOfFrames: 4,
      sizescale: .065,
    })

    this.sprite = torchSprite

    this.hitBoxCoords = () => ({ x: this.x+(.5*TS), y: this.y+(.4*TS) })

    this.hitBox = new BoundingElliptic({
      coords: this.hitBoxCoords.bind(this),
      xSemiAxis: .2*TS,
      ySemiAxis: .1*TS,
      isMovingBoundary: true,
    })

    let killable = new Killable({
      maxHitPoints: 10,
      maxDamageFrames: 10,
      onDeath: this.destroyTorch
    })

    // compose killable into torch
    Object.assign(this, killable)
  }

  destroyTorch(){
    activeRoom.torches = activeRoom.torches.filter(torch => torch !== this)
    if(activeRoom.torches.length === 0) overlayManager.addDarkRoomOverlay()
  }

  draw(){
    this.sprite.draw()
    if(this.takingDamage) this.damagedAnimation()
  }
}

export default Torch
