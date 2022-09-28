import {TS} from '../constants'

class Tile{
  constructor(img, layer, x, y, options = {}){
    this.x = x;
    this.y = y;
    this.layer=layer;
    this.img = img;
    this.boundaries = options.boundaries || []
    this.depthBreakpoint = options.depthBreakpoint 
  }

  draw(){
    if(Array.isArray(this.img)){
      this.img.forEach(img => ctx.drawImage(img, this.x*TS, this.y*TS, TS,TS)) 
    } else {
      ctx.drawImage(this.img, this.x*TS, this.y*TS, TS,TS);
    }
  }

  drawDebug(debugColor){
    ctx.save();
    ctx.textAlign = 'center'
    ctx.fillStyle = debugColor
    ctx.font = "16px Arial";
    ctx.fillText(`${this.x}, ${this.y}`, this.x*TS+TS*.5, this.y*TS+TS*.5);
    ctx.restore();
  }
}

export default Tile