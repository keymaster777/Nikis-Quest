import Structure from "./Structure";
import FloorTile from "../tiles/FloorTile";
import WallTile from "../tiles/WallTile";
import { UP, DOWN, LEFT, RIGHT } from "../constants"

class Wall extends Structure{
    constructor(x, y, direction){
        super(x,y);
        this.direction = direction;

        this.wallImg = (innerWall = true) => {
          let random = Math.random();
          if (innerWall){
              switch(true){
                  case random < .05:
                      return imgs.wallHole;
                  case random < .075:
                      return imgs.wallBannerYellow;
                  case random < .1:
                      return imgs.wallBannerRed;
                  case random < .105:
                      return imgs.wallGoo;
                  default:
                      return imgs.wallMid;
              }
          }else{
              switch(true){
                  case random < .05:
                      return imgs.wallHole;
                  case random < .1:
                      return imgs.wallHoleTwo;
                  case random < .105:
                      return imgs.wallGoo;
                  default:
                      return imgs.wallMid;
              }
          }
        }

        this.build();
    }
    
    build(){
        switch(this.direction){
            case DOWN:
                this.selfArray.push(new FloorTile(this.x, this.y-1));
                this.selfArray.push(new WallTile(imgs.wallMidTop, 3 , this.x, this.y-1, {},true));
                this.selfArray.push(new WallTile(this.wallImg(false), 3 , this.x, this.y, {obstructing:true},true));
                break;
            case UP:
                this.selfArray.push(new WallTile(imgs.wallMidTop, 3 , this.x, this.y, {},true));
                this.selfArray.push(new WallTile(this.wallImg(), 2 , this.x, this.y+1, {obstructing:true},true));
                break;
            case LEFT:
                this.selfArray.push(new WallTile(imgs.wallSideMidRight, 3 , this.x, this.y, {obstructing:true, hitboxLeft:true},true));
                this.selfArray.push(new FloorTile(this.x, this.y));
                break;
            case RIGHT:
                this.selfArray.push(new WallTile(imgs.wallSideMidLeft, 3 , this.x, this.y, {obstructing:true, hitboxRight:true},true));
                this.selfArray.push(new FloorTile(this.x, this.y));
                break;
        }

        this.occupyingSpaces = this.selfArray.map(i => [i.x,i.y]);
    }
}

export default Wall