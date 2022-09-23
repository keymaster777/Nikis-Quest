import Wall from "./structures/Wall"
import FloorColumn from "./structures/FloorColumn";
import DoorTile from "./tiles/DoorTile";
import FloorTile from "./tiles/FloorTile";
import Potion from "./tiles/Potion";
import Chest from "./tiles/Chest"
import Goblin from "./monsters/Goblin"
import Chort from "./monsters/Chort"
import Pit from "./structures/Pit";

import {randomIntFromInterval} from "./helpers"
import {TS, UP, LEFT, RIGHT, DOWN, DOWNLEFT, DOWNRIGHT, UPLEFT, UPRIGHT, CANVAS_WIDTH, CANVAS_HEIGHT} from "./constants"

class Room{
    constructor( x, y){
        this.x = x;
        this.y = y;
        this.spawnLocation = {x: null, y: null};
        this.monsters = [];
        this.width = randomIntFromInterval(5,10);
        this.height = randomIntFromInterval(3,6) + 2;
        this.tileArray = [];
        this.doorTiles = [];
        this.doors = {};
        this.occupiedSpaces = [];
        this.torches = [];
        this.built = false
        this.lpad = (CANVAS_WIDTH-(this.width*TS))/2
        this.randomNum = Math.random()
        this.visited = false // Player has physically been in the room
        this.seen = false // Player has been in an adjacent room with door access
        this.staticBoundaries = [];
        this.queuedBoundariesForMerge = []
    }

    /* =================================== */
    /*            Helper Methods           */
    /* =================================== */
    isOccupiedTile(x,y){
        return this.occupiedSpaces.find(space => space[0] == x && space[1] == y) != undefined
    }

    hasDoor(direction){
        return this.doors[direction] != undefined
    }

    entranceCoords(){
      let entryDoor = this.doors[this.enteredFrom]
      return {x: entryDoor.x*TS+.5*TS, y: entryDoor.y*TS+.5*TS}
    }

    distanceFromCenter(){
        return (Math.sqrt( this.x**2 + this.y**2 ));
    }

    adjacentAccessToRoom(room){
        if(this.x-1 == room.x && this.y == room.y && this.hasDoor(LEFT)) return true
        if(this.x+1 == room.x && this.y == room.y && this.hasDoor(RIGHT)) return true
        if(this.x == room.x && this.y-1 == room.y && this.hasDoor(UP)) return true
        if(this.x == room.x && this.y+1 == room.y && this.hasDoor(DOWN)) return true
    }

    randomFloorConstruct(x,y){
        let random = Math.random();
        let construct = null

        if(random < .5 && y > 2) {
            construct = new FloorColumn(x,y+1);
            construct.boundaries.forEach(boundary => this.staticBoundaries.push(boundary))
            if(random < .25){
                construct.addTorch()
                this.torches.push(construct.torch)
            }
        } else {
            construct = new Pit(x,y,this.occupiedSpaces);
            construct.boundaries.forEach(bound => this.queuedBoundariesForMerge.push(bound))
        }

        this.tileArray = this.tileArray.concat(construct.selfArray);
        this.occupiedSpaces = this.occupiedSpaces.concat(construct.occupyingSpaces)
    }

    /* =================================== */
    /*            Build Methods            */
    /* =================================== */
    buildFloor(){

        for(var x=1; x<this.width-1; x++){
            for(var y=3; y<this.height-1; y++){
                if(!this.isOccupiedTile(x,y)){
                    let random = Math.random();
                    if (random < .1){
                        this.randomFloorConstruct(x,y);
                    }
                }
            }
        }

        for(var x=0; x<this.width; x++){
            for(var y=1; y<=this.height-1; y++){
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

    buildWalls(){
        let coordsForWalls = []
        let doorCoords = this.doorTiles.map(tile => ({x: tile.x, y: tile.y}))

        for(var w = 0; w < this.width; w++){
            let topDoorPresent = doorCoords.find(coord => coord.x == w && coord.y == 1) != undefined
            let bottomDoorPresent = doorCoords.find(coord => coord.x == w && coord.y == this.height) != undefined
            coordsForWalls.push({x: w, y: 1, hasDoor: topDoorPresent })
            coordsForWalls.push({x: w, y: this.height, hasDoor: bottomDoorPresent})
        }
        for(var h = 2; h < this.height; h++){
            let leftDoorPresent = doorCoords.find(coord => coord.x == 0 && coord.y == h) != undefined
            let rightDoorPresent = doorCoords.find(coord => coord.x == this.width-1 && coord.y == h) != undefined
            coordsForWalls.push({x: 0, y: h, hasDoor: leftDoorPresent})
            coordsForWalls.push({x: this.width-1, y: h, hasDoor: rightDoorPresent})
        }

        coordsForWalls.forEach(coord => {
            let createdWall = new Wall(coord.x, coord.y, coord.hasDoor, coordsForWalls)
            if(Math.random() < .15 && createdWall.canHoldTorch()){
                createdWall.addTorch()
                this.torches.push(createdWall.torch)
            } 

            createdWall.boundaries.forEach(bound => this.queuedBoundariesForMerge.push(bound))

            this.tileArray = this.tileArray.concat(createdWall.selfArray)
            this.occupiedSpaces = this.occupiedSpaces.concat(createdWall.occupyingSpaces)
        })
    }

    buildDoors(){
        [UP, DOWN, LEFT, RIGHT].forEach(direction => {
            this.tileArray = this.tileArray.concat(this.doors[direction]?.selfArray || []);
            this.occupiedSpaces = this.occupiedSpaces.concat(this.doors[direction]?.floorSpaces || []);
        })

        this.doorTiles = this.tileArray.filter(tile => tile instanceof DoorTile);
    }

    spawnItems(){
        let floorArray = this.tileArray.filter(tile => tile instanceof FloorTile && tile.x > 0 && tile.x < this.width-1);
        for(var i = 0; i<floorArray.length;i++){
            var random = randomIntFromInterval(1,1000);
            switch(true){
                case random < 10:
                    let chest = new Chest(floorArray[i].x, floorArray[i].y)
                    this.tileArray.push(chest);
                    this.staticBoundaries.push(chest.boundary)
                    this.occupiedSpaces.push([chest.x, chest.y])
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
            let monster = false
            if (random >= 0 && random < 0.15) monster = new Goblin(tile.x, tile.y)
            if (random >= 0.15 && random < .18) monster = new Chort(tile.x, tile.y)

            if (monster){
                this.monsters.push(monster)
            }
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
        if (this.torches.length > 0) message = "**torch crackling**"
        if (input.isDown('w') || input.isDown('d') || input.isDown('a') || input.isDown('s')) message = "**footsteps**"
        if (this.monsters.find(monster => monster instanceof Chort)) message = "**Chorts snickering**"
        if (this.monsters.find(monster => monster instanceof Goblin)) message = "**angry goblin noises**"
        if (this.monsters.find(monster => monster instanceof Goblin && monster.takingDamage)) message = "**angrier goblin noises**"
        if (this.tileArray.find(tile => (tile instanceof Chest) && tile.takingDamage)) message = "**wood splintering**" 
        if (this.monsters.find(monster => monster instanceof Chort && monster.isAgitated())) message = "**CHORTS SHRIEKING**"
        if (player.isFalling && Date.now() - player.fallTimer > 500) message = "**Niki screams as she tumbles into oblivion**"
        return message
    }

    mergeQueuedBounds() {
        this.mergeHorizontalBounds()
        this.mergeVerticalBounds()
    }

    mergeHorizontalBounds(){
        let sortedBounds = this.queuedBoundariesForMerge.sort((a, b) => (a.x > b.x) ? 1 : -1)
        let newBound = sortedBounds.find(bound => bound.width == TS)
        if (newBound == undefined) return
        let filteredBounds = sortedBounds.filter(bound => bound.y+bound.height == newBound.y+newBound.height)
        for(let i = 1; i <= this.width; i++){
           let bound = filteredBounds.find(bound => bound.x == newBound.x+(TS*i))
           if (bound == undefined) break
           newBound.width += bound.width
           this.queuedBoundariesForMerge = this.queuedBoundariesForMerge.filter(b => b != bound)
        } 
        this.queuedBoundariesForMerge = this.queuedBoundariesForMerge.filter(b => b != newBound)
        this.staticBoundaries.push(newBound)
        this.mergeHorizontalBounds()
    }

    mergeVerticalBounds(){
        let sortedBounds = this.queuedBoundariesForMerge.sort((a, b) => (a.y > b.y) ? 1 : -1)
        let newBound = sortedBounds.find(bound => bound.height == TS)
        if (newBound == undefined) return
        let filteredBounds = sortedBounds.filter(bound => bound.x+bound.width == newBound.x+newBound.width)
        for(let i = 1; i <= this.height; i++){
           let bound = filteredBounds.find(bound => bound.y == newBound.y+(TS*i))
           if (bound == undefined) break
           newBound.height += bound.height
           this.queuedBoundariesForMerge = this.queuedBoundariesForMerge.filter(b => b != bound)
        } 
        this.queuedBoundariesForMerge = this.queuedBoundariesForMerge.filter(b => b != newBound)
        this.staticBoundaries.push(newBound)
        this.mergeVerticalBounds()
    }

    buildRoom(){
        this.buildDoors()
        this.buildWalls();
        this.buildFloor();
        this.spawnItems();
        this.spawnMonsters();
        this.mergeQueuedBounds();
        this.built = true
    }

    boundaries(){
        let monsterBoundaries = this.monsters.map(monster => monster.boundary)
        return [...monsterBoundaries, ...this.staticBoundaries, player.boundary]
    }

    hitBoxes(){
        let monsterHitBoxes = this.monsters.map(monster => monster.hitBox)
        let chests = this.tileArray.filter(tile => tile.hitBox != undefined).map(tile => tile.hitBox)
        let torches = this.torches.map(torch => torch.hitBox)
        return [ ...monsterHitBoxes, ...chests, ...torches, player.hitBox]
    }

    effectBounds(){
        let doors = Object.values(this.doors).map(door => door.effectBox)
        return [ ...doors] 
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

        var objectsWithLayerVariety = [...layerVaries, ...this.monsters, ...this.torches, player]

        objectsWithLayerVariety = objectsWithLayerVariety.sort((a,b) => {
            var elements = [a,b].map(ele => {
                if (ele.depthBreakpoint != undefined) return ele.depthBreakpoint
                if (ele.isFalling == true) return ele.y - TS
                return ele.y
            })
            
            return elements[0] - elements[1]
        })

        objectsWithLayerVariety.forEach(ele => {
            if (ele.isDashing || ele.takingDamage) ctx.globalAlpha = 0.6;
            if(ele.isFalling == true){
                let transparency = 1 - (Date.now() - ele.fallTimer)/1000*.7
                ctx.globalAlpha = transparency > 0 ? transparency : 0
            }
            ele.draw()
            ctx.globalAlpha = 1;
        })

        layer3.forEach(ele => ele.draw())

        // this.boundaries().forEach(boundary => boundary.drawArea("red", this.boundaries()))

        // this.hitBoxes().forEach(hitBox => hitBox.drawArea("green"))
        
        // Object.values(this.doors).forEach(door => door.effectBox.drawArea('yellow'))

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.fillStyle = "#b8b5b9"
        ctx.textAlign = "center"
        ctx.font = "20px Arial";
        ctx.fillText(this.roomMessage(), CANVAS_WIDTH/2, CANVAS_HEIGHT - 10);
    }
}

export default Room