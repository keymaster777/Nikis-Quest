import Structure from "./Structure";
import TestTile from "../tiles/TestTile";
import BoundingRectangle from "../boundingAreas/BoundingRectange";
import Sprite from "../Sprite";
import Torch from "../Torch";
import { TS } from "../constants"

class Wall extends Structure{
    constructor(x, y, hasDoor, otherWallCoords){
      super()
      this.x = x
      this.y = y
      this.hasDoor = hasDoor
      this.otherWallCoords = otherWallCoords
      this.leftWall = x == Math.min(...otherWallCoords.map(coord => coord.x))
      this.rightWall = x == Math.max(...otherWallCoords.map(coord => coord.x))
      this.topWall = y == Math.min(...otherWallCoords.map(coord => coord.y))
      this.bottomWall = y == Math.max(...otherWallCoords.map(coord => coord.y))
      this.maxY = Math.max(...otherWallCoords.map(coord => coord.y))
      this.doorBelow = otherWallCoords.find(coord => coord.x == this.x && coord.y == this.y+1)?.hasDoor
      this.torch = undefined
      this.buildTiles()
      this.boundaries = this.buildBoundaries()

    }

    randomTopWallImg(){
      let random = Math.random();
      if (random < .05) return imgs.wallHole;
      if (random < .075) return imgs.wallBannerYellow;
      if (random < .1) return imgs.wallBannerRed;
      if (random < .105) return imgs.wallGoo;
      return imgs.wallMid;
    }

    randomBottomWallImg(){
      let random = Math.random();
      if (random < .05) return imgs.wallHole;
      if (random < .1) return imgs.wallHoleTwo;
      if (random < .105) return imgs.wallGoo;
      return imgs.wallMid;
    }

    canHoldTorch() {
      if (this.hasDoor || this.bottomWall) return false
      if (this.topWall && (this.leftWall || this.rightWall)) return false 
      return true
    }

    addTorch() {
      let tile = this.selfArray[0]
      if(this.topWall) tile.img = imgs.wallMid // So torch doesnt render on a flag or slime wall img

      this.torch = new Torch(this.x, this.y)

      if(this.leftWall) this.torch.sprite.image = imgs.torchSideLeft
      if(this.rightWall) this.torch.sprite.image = imgs.torchSideRight
    }

    buildBoundaries() {
      if(this.hasDoor) return [];

      let boundaries = []

      if(this.leftWall) boundaries.push(
        new BoundingRectangle({
          coords: (()=> ({x: this.x*TS, y: this.y*TS})),
          coordsAreVolatile: true,
          width: TS*.25,
          height: TS,
          cancelsDash: true
        })
      )

      if(this.rightWall) boundaries.push(
        new BoundingRectangle({
          coords: (()=> ({x: this.x*TS+.75*TS, y: this.y*TS})),
          coordsAreVolatile: true,
          width: TS*.25,
          height: TS,
          cancelsDash: true
        })
      )

      if(this.topWall) boundaries.push(
        new BoundingRectangle({
          coords: (()=> ({x: this.x*TS, y: this.y*TS})),
          width: TS,
          height: TS,
          cancelsDash: true
        })
      )

      if(this.bottomWall) boundaries.push(
        new BoundingRectangle({
          coords: (()=> ({x: this.x*TS, y: this.y*TS+.5*TS})),
          width: TS,
          height: TS*.5,
          cancelsDash: true
        })
      )

      return boundaries
    }

    buildTiles() {
      let wall = new TestTile(imgs.wallMid, 3, this.x, this.y /*{boundaries: this.buildBoundaries()}*/)

      let wallTopper = new TestTile(imgs.wallMidTop, 3, this.x, this.y-1)

      if(this.bottomWall) wall.img = this.randomBottomWallImg()

      if(this.leftWall){
        wall.img = imgs.wallSideMidRight
        if (this.doorBelow) wall.img = imgs.wallSideFrontRight
        if (this.y+1==this.maxY) wall.img = imgs.wallInnerCornerTopLeft 
        if (this.bottomWall) wall.img = imgs.wallLeft
        if (this.topWall) wallTopper.img = imgs.wallTopLeft
      }

      if(this.rightWall){
        wall.img = imgs.wallSideMidLeft
        if (this.doorBelow) wall.img = imgs.wallSideFrontLeft
        if (this.y+1==this.maxY) wall.img = imgs.wallInnerCornerTopRight 
        if (this.bottomWall) wall.img = imgs.wallRight
        if (this.topWall) wallTopper.img = imgs.wallTopRight
      }
      
      if(this.topWall){
        wall.img =  this.randomTopWallImg()
        if(this.leftWall) wall.img = [this.randomTopWallImg(), imgs.wallSideMidRight]
        if(this.rightWall) wall.img = [this.randomTopWallImg(), imgs.wallSideMidLeft]
        if(!this.hasDoor) wallTopper.layer = 2 // So torch sprites render above wall topper
        this.occupyingSpaces = [[this.x, this.y]]
      }

      if(this.hasDoor){
        if(this.leftWall) wall.img = imgs.wallSideTopRight
        if(this.rightWall) wall.img = imgs.wallSideTopLeft
        if(this.bottomWall || this.topWall) wallTopper.img = imgs.wallArch
      }

      if(this.topWall) wall.layer = 2
      if(this.doorBelow){
        wall.layer = '*'
        wall.depthBreakpoint = this.y*TS+TS
      }



      if(this.hasDoor && (this.bottomWall || this.topWall)) {
        this.selfArray.push(wallTopper)
      } else if(this.topWall || (this.bottomWall && !this.leftWall && !this.rightWall)){
        this.selfArray = this.selfArray.concat([wall, wallTopper])
      } else {
        this.selfArray.push(wall)
      }
    }
        
}

export default Wall