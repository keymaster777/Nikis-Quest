import { TS } from "./constants"

class Sprite{
  constructor(options){
    // If sprite is stationary, use passed in x and y options
    this.x = options.x
    this.y = options.y

    // If sprite moves use coords function to get parent objects x and y
    this.isMovingBoundary = options.isMovingBoundary || false
    this.coords = options.coords || (() => ({ x: this.x, y: this.y }))

    this.depthBreakpoint = options.depthBreakpoint

    this.frameIndex = 0,
    this.tickCount = 0,
    this.ticksPerFrame = options.ticksPerFrame || 8
    this.numberOfFrames = options.numberOfFrames || 1
    this.width = options.width || 0
    this.height = options.height || 0
    this.image = options.image
    this.sizescale = options.sizescale || 1
    this.sizescaleAdjust = 0
    this.xAdjust = 0
    this.yAdjust = 0
  }

  update(){
    this.tickCount += 1
    if (this.numberOfFrames === 1 || this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0
      this.frameIndex = this.frameIndex < this.numberOfFrames -1 ? this.frameIndex + 1 : 0
    }
  }

  render(){
    if (this.coords !== undefined){
      let coords = this.coords()
      this.x = coords.x
      this.y = coords.y
    }

    const { image, frameIndex, width, height, xAdjust, yAdjust, x, y } = this

    ctx.drawImage(
      image,                                   // Sprite Image
      frameIndex * width, 0,  // X and Y starting point for portion of sprite map to show
      width, height,          // Width and height of visible portion of sprite map
      x+xAdjust-this.calculatedWidth()/2,      // X start of sprite render
      y+yAdjust-this.calculatedHeight(),
      this.calculatedWidth(),
      this.calculatedHeight()
    )
  }

  calculatedWidth() {
    return TS*(this.sizescale+this.sizescaleAdjust)*this.width
  }

  calculatedHeight(){
    return TS*(this.sizescale+this.sizescaleAdjust)*this.height
  }

  draw(){
    this.update()
    this.render()
  }
}

export default Sprite