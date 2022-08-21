import Door from "./structures/Door";
import Corner from "./structures/Corner";
import Wall from "./structures/Wall"
import WallColumn from "./structures/WallColumn";
import FloorColumn from "./structures/FloorColumn";
import DoorTile2 from "./tiles/DoorTile2";
import TorchWall from "./structures/TorchWall";
import FloorTile from "./tiles/FloorTile";
import WallTile2 from "./tiles/WallTile2";
import Potion from "./tiles/Potion";
import Chest from "./tiles/Chest"
import Goblin from "./monsters/Goblin"
import Chort from "./monsters/Chort"
import Pit from "./structures/Pit";

import {randomIntFromInterval} from "./helpers"
import {TS, UP, LEFT, RIGHT, DOWN, DOWNLEFT, DOWNRIGHT, UPLEFT, UPRIGHT, CANVAS_WIDTH, CANVAS_HEIGHT} from "./constants"
import Level from "./Level";

class Room{
    constructor( x, y, enteredFrom = false, allRooms = [] ){
        this.x = x;
        this.y = y;
        this.enteredFrom = enteredFrom
        this.spawnLocation = {x: null, y: null};
        this.monsters = [];
        this.width = randomIntFromInterval(5,10);
        this.height = randomIntFromInterval(3,6) + 2;
        this.tileArray = [];
        this.doorTiles = [];
        this.doors = [];
        this.corners = [];
        this.occupiedSpaces = [];
        this.sprites = [];
        this.buildDoors(allRooms);
        this.buildWalls();
        this.buildFloor();
        this.spawnItems();
        this.spawnMonsters();
        this.leftFrom;
        this.lpad = (CANVAS_WIDTH-(this.width*TS))/2
        this.randomNum = Math.random()
    }

    /* =================================== */
    /*            Helper Methods           */
    /* =================================== */
    isOccupiedTile(x,y){
        return this.occupiedSpaces.find(space => space[0] == x && space[1] == y) != undefined
    }

    hasDoor(direction){
        for(var door of this.doors){
            if(door.direction == direction && door.enabled == true){
                return true;
            }
        }
        return false
    }

    entranceCoords(){
      let entryDoor = this.doors.find(door => door.direction == this.enteredFrom)
      if(this.enteredFrom == UP) {
        return {x: entryDoor.x*TS+.5*TS, y: entryDoor.y*TS+1.5*TS}
      } else {
        return {x: entryDoor.x*TS+.5*TS, y: entryDoor.y*TS+.5*TS}
      }
    }

    distanceFromCenter(){
        return (Math.sqrt( this.x**2 + this.y**2 ));
    }

    randomWallConstruct(x,y,direction){
        let random = Math.random();
        let construct = null
        if(direction == UP){
            switch(true){
                case random < .5:
                    construct = new WallColumn(x,y, UP);
                    break;
                case random >= .5:
                    construct = new TorchWall(x,y, UP);
                    this.sprites.push(construct)
                    break;
            }
        }
        if(direction == LEFT){
            switch(true){
                case random < 1:
                    construct = new TorchWall(x,y, LEFT);
                    this.sprites.push(construct)
            }
        }
        if(direction == RIGHT){
            switch(true){
                case random < 1:
                    construct = new TorchWall(x,y, RIGHT);
                    this.sprites.push(construct)
            }
        }
        if(direction == DOWN){
            switch(true){
                case random < 1:
                    construct = new WallColumn(x,y, DOWN);
            }
        }

        this.tileArray = this.tileArray.concat(construct.selfArray)
        this.occupiedSpaces = this.occupiedSpaces.concat(construct.occupyingSpaces)
    }

    randomFloorConstruct(x,y){
        let random = Math.random();
        let construct = null

        switch(true){
            case random < .5:
                construct = new FloorColumn(x,y);
                break;
            case random >= .5:
                construct = new Pit(x,y,this.occupiedSpaces);
                break;
        }

        this.tileArray = this.tileArray.concat(construct.selfArray);
        this.occupiedSpaces = this.occupiedSpaces.concat(construct.occupyingSpaces)
    }


    /* =================================== */
    /*            Build Methods            */
    /* =================================== */
    buildFloor(){

        for(var x=0; x<this.width; x++){
            for(var y=0; y<=this.height; y++){
                if(!this.isOccupiedTile(x,y)){
                    let random = Math.random();
                    if (random < .1){
                        this.randomFloorConstruct(x,y);
                    }
                }
            }
        }

        for(var x=0; x<this.width; x++){
            for(var y=0; y<=this.height; y++){
                if(!this.isOccupiedTile(x,y)){
                    // Intentionally not updating occupied spaces with basic flooring
                    this.tileArray.push(new FloorTile(x, y));
                    if(this.spawnLocation["x"] == null){
                      this.spawnLocation = {x: x*TS+.5*TS, y: y*TS+.5*TS};
                      this.occupiedSpaces = this.occupiedSpaces.concat([x, y]);
                    }
                }
            }
        }
    }

    addWallConstruct(x, y, direction){
      let wall = new Wall(x, y, direction)
      this.tileArray = this.tileArray.concat(wall.selfArray)
      this.occupiedSpaces = this.occupiedSpaces.concat(wall.occupyingSpaces)
    }

    buildWalls(){
        //Builds corners
        this.corners[0] = new Corner(0, 0, UPLEFT);
        this.corners[1] = new Corner(this.width-1, 0, UPRIGHT);
        this.corners[2] = new Corner(0, this.height, DOWNLEFT);
        this.corners[3] = new Corner(this.width-1, this.height, DOWNRIGHT);

        //Adds corners to main tile array
        this.corners.forEach(corner => {
          this.tileArray = this.tileArray.concat(corner.selfArray)
          this.occupiedSpaces = this.occupiedSpaces.concat(corner.occupyingSpaces)
        })

        //Adds walls along top and bottom
        for(var w = 0; w < this.width; w++){
            if(!this.isOccupiedTile(w,0)){
                let random = Math.random();
                if (random < .1){
                    this.randomWallConstruct(w, 0,UP);
                }else{
                    this.addWallConstruct(w, 0, UP)
                }
            }
            if(!this.isOccupiedTile(w,this.height)){
                let random = Math.random();
                if (random < .1){
                    this.randomWallConstruct(w,this.height,DOWN);
                }else{
                    this.addWallConstruct(w, this.height, DOWN)
                }
            }
        }

        //Adds walls along left and right
        for(var h = 0; h < this.height; h++){
            if(!this.isOccupiedTile(0,h)){
                let random = Math.random();
                if (random < .15){
                    this.randomWallConstruct(0,h,LEFT);
                }else{
                    this.addWallConstruct(0, h, LEFT)
                }
            }
            if(!this.isOccupiedTile(this.width-1,h)){
                let random = Math.random();
                if (random < .15){
                    this.randomWallConstruct(this.width-1,h,RIGHT);
                }else{
                    this.addWallConstruct(this.width-1, h, RIGHT)
                }
            }
        }
    }

    buildDoors(allRooms){
        this.doors[0] = new Door(randomIntFromInterval(1, this.width-2), 0, UP);
        this.doors[1] = new Door(randomIntFromInterval(1, this.width-2), this.height, DOWN);
        this.doors[2] = new Door(0,randomIntFromInterval(3, this.height-2), LEFT);
        this.doors[3] = new Door(this.width-1, randomIntFromInterval(3, this.height-2), RIGHT);

        //Enable door player entered from
        if (this.enteredFrom) {
          let entryDoor = this.doors.find(door => door.direction == this.enteredFrom)
          entryDoor.enabled = true
        }

        //Enable doors randomly based on how far from origin room current room is
        for( var i = 0; i<this.doors.length; i++){
            let random = Math.random() * this.distanceFromCenter();
            if(random < 0.6){
                this.doors[i].enabled = true;
            }
        }

        //Disables door if adjacent discovered room lacks a sister door in that spot
        if(allRooms.find(room => room.x == this.x-1 && room.y == this.y)?.hasDoor(RIGHT) == false){
            this.doors[2].enabled = false;
        }
        if(allRooms.find(room => room.x == this.x+1 && room.y == this.y)?.hasDoor(LEFT) == false){
            this.doors[3].enabled = false;
        }
        if(allRooms.find(room => room.x == this.x && room.y == this.y-1)?.hasDoor(DOWN) == false){
            this.doors[0].enabled = false;
        }
        if(allRooms.find(room => room.x == this.x && room.y == this.y+1)?.hasDoor(UP) == false){
            this.doors[1].enabled = false;
        }

        //Enables door if adjacent discovered room has a sister door in that spot
        if(allRooms.find(room => room.x == this.x-1 && room.y == this.y)?.hasDoor(RIGHT) == true){
            this.doors[2].enabled = true;
        }
        if(allRooms.find(room => room.x == this.x+1 && room.y == this.y)?.hasDoor(LEFT) == true){
            this.doors[3].enabled = true;
        }
        if(allRooms.find(room => room.x == this.x && room.y == this.y-1)?.hasDoor(DOWN) == true){
            this.doors[0].enabled = true;
        }
        if(allRooms.find(room => room.x == this.x && room.y == this.y+1)?.hasDoor(UP) == true){
            this.doors[1].enabled = true;
        }
       

        //Adds all enabled doors to the main tile array
        for(var door of this.doors){
            if(door.enabled == true){
                this.tileArray = this.tileArray.concat(door.selfArray);
                this.occupiedSpaces = this.occupiedSpaces.concat(door.occupyingSpaces);
            }
        }

        this.doorTiles = this.tileArray.filter(tile => tile instanceof DoorTile2);
    }

    spawnItems(){
        let floorArray = this.tileArray.filter(tile => tile instanceof FloorTile && tile.x > 0 && tile.x < this.width-1);
        for(var i = 0; i<floorArray.length;i++){
            var random = randomIntFromInterval(1,1000);
            switch(true){
                case random < 10:
                    this.tileArray.push(new Chest(floorArray[i].x, floorArray[i].y));
                    this.occupiedSpaces = this.occupiedSpaces.concat([floorArray[i].x, floorArray[i].y]);
                break;
                case random < 20:
                    this.tileArray.push(new Potion(floorArray[i].x, floorArray[i].y));
                    this.occupiedSpaces = this.occupiedSpaces.concat([floorArray[i].x, floorArray[i].y]);
                break;
            break;
            }
        }
    }

    spawnMonsters(){
        if (this.x == 0 && this.y == 0) return null;
        let unoccupiedFloorArray = this.tileArray.filter(tile => tile instanceof FloorTile && !this.isOccupiedTile(tile.x, tile.y));
        unoccupiedFloorArray.forEach(tile => {
            let random = Math.random();
            if (random >= 0 && random < 0.15) this.monsters.push(new Goblin(tile.x, tile.y))
            if (random >= 0.15 && random < .18) this.monsters.push(new Chort(tile.x, tile.y))
        })
    }

    rareMessage() {
       if (this.randomNum >= 0 && this.randomNum < 0.01) return "**distant baby crying**"
       if (this.randomNum >= 0.01  && this.randomNum < 0.02) return "**tornado siren wailing**"
       if (this.randomNum >= 0.02  && this.randomNum < 0.03) return "**low whispers that sound like gen Z slang**"
       if (this.randomNum >= 0.03  && this.randomNum < 0.04) return "**crickets**"
       if (this.randomNum >= 0.04  && this.randomNum < 0.05) return "**sounds of being hopelessly lost**"
       if (this.randomNum >= 0.05  && this.randomNum < 0.06) return "**the sound of silence**"
       return null 
    }

    roomMessage(){
        // These are organized in priority, each condition overwrites the message
        let message = this.rareMessage() || ""
        if (this.sprites.find(sprite => sprite instanceof TorchWall)) message = "**torch crackling**"
        if (player.isMoving) message = "**footsteps**"
        if (this.monsters.find(monster => monster instanceof Chort)) message = "**Chorts snickering**"
        if (this.monsters.find(monster => monster instanceof Goblin)) message = "**angry goblin noises**"
        if (this.monsters.find(monster => monster instanceof Goblin && monster.takingDamage)) message = "**angrier goblin noises**"
        if (this.tileArray.find(tile => (tile instanceof Chest) && tile.takingDamage)) message = "**wood splintering**" 
        if (this.monsters.find(monster => monster instanceof Chort && monster.isMoving)) message = "**CHORTS SHRIEKING**"
        if (level.rooms.length == 1) message = "LEAVE THIS ROOM THROUGH ONE OF THE 4 DOORS."
        return message
    }
    
    drawRoom(){
        ctx.translate(activeRoom.lpad, 0);
        var layerVaries = this.tileArray.filter(tile => tile.layer == '*');
        var layer0 = this.tileArray.filter(tile => tile.layer == 0);
        var layer1 = this.tileArray.filter(tile => tile.layer == 1);
        var layer2 = this.tileArray.filter(tile => tile.layer == 2);
        var layer3 = this.tileArray.filter(tile => tile.layer == 3);


        layer0.forEach(ele => ele.draw())
        layer1.forEach(ele => ele.draw())
        layer2.forEach(ele => ele.draw())
        var sprites = this.sprites.map(ele => ele.sprite)

        var objectsWithLayerVariety = [...layerVaries, ...this.monsters, ...sprites, player]

        objectsWithLayerVariety = objectsWithLayerVariety.sort((a,b) => {
            var elements = [a,b].map(ele => {
                if (ele instanceof WallTile2) return ele.y*TS+TS; 
                if (ele instanceof Potion) return ele.y*TS+40;
                if (ele instanceof Chest) return ele.y*TS+40;
                if (ele.numberOfFrames != undefined) return ele.y+50
                return ele.y
            })
            
            return elements[0] - elements[1]
        })

        objectsWithLayerVariety.forEach(ele => ele.draw())

        layer3.forEach(ele => ele.draw())

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.fillStyle = "#b8b5b9"
        ctx.textAlign = "center"
        ctx.font = "20px Arial";
        ctx.fillText(this.roomMessage(), CANVAS_WIDTH/2, CANVAS_HEIGHT - 10);
    }
}

export default Room