import {TS} from './constants'

class Sprite{
  constructor(options){
    // If sprite is stationary, use passed in x and y options
    this.x = options.x
    this.y = options.y

    // If sprite moves use coords function to get parent objects x and y
    this.isMovingBoundary = options.isMovingBoundary || false
    this.coords = options.coords || (() => ({x: this.x, y: this.y}))

    this.depthBreakpoint = options.depthBreakpoint

    this.frameIndex = 0,
    this.tickCount = 0,
    this.ticksPerFrame = options.ticksPerFrame || 8;
    this.numberOfFrames = options.numberOfFrames || 1;
    this.width = options.width || 0;
    this.height = options.height || 0;
    this.image = options.image;
    this.sizescale = options.sizescale || 1;
    this.xAdjust = 0
  }

  update(){
    this.tickCount += 1;
    if (this.numberOfFrames == 1 || this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;
      this.frameIndex = this.frameIndex < this.numberOfFrames -1 ? this.frameIndex + 1 : 0
    }
  }

  render(){
    if (this.coords != undefined){
      let coords = this.coords()
      this.x = coords.x
      this.y = coords.y
    }

    const {image, frameIndex, width, height, numberOfFrames, xAdjust, sizescale, x, y} = this

    ctx.drawImage(
      image,                                   // Sprite Image
      frameIndex * width / numberOfFrames, 0,  // X and Y starting point for portion of sprite map to show
      width / numberOfFrames, height,          // Width and height of visible portion of sprite map
      x + xAdjust, y,                          // Where to render sprite
      TS*sizescale*width / numberOfFrames,     // Horizontal scaling of image
      TS*sizescale*height                       // Vertical scaling of image
    );
  }

  draw(){
    this.update()
    this.render()
  }
}

export default Sprite