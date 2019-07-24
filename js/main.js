var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
const TS = 60;
const UP = "up";
const DOWN = "down";
const LEFT = "left";
const RIGHT = "right";
const UPLEFT = "upleft";
const UPRIGHT = "upright";
const DOWNLEFT = "downleft";
const DOWNRIGHT = "downright";
var roomHistory=[];
var uniqueRooms = 0;
canvas.width = TS*16;
canvas.height = TS*10;
document.body.appendChild(canvas);
var playerLocation = document.getElementById("position");



var playerImage = new Image();
playerImage.src = 'img/player/run-right.png';
var player_sprite = sprite({
    context: ctx,
    width: 256,
    height: 32,
    image: playerImage,
    numberOfFrames: 8,
    sizescale: .04,
});

var torchImage = new Image();
torchImage.src = 'img/sprites/torch.png';
var torch_sprite = sprite({
    context: ctx,
    width: 64,
    height: 16,
    image: torchImage,
    numberOfFrames: 4,
    sizescale: .05,
    x:3*TS,
    y:TS
});
var player = new Player(player_sprite);

startLoadingAllImages(start);
function start(){
    ctx.imageSmoothingEnabled = false;
    main();
}


function randomIntFromInterval(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}



function printArray(arr, preamble = ""){
    var result = "";
    for(var i = 0; i<arr.length; i++){
        result+=arr[i].toString()+", " ;
    }
    console.log(preamble + "["+result+"]");
}

function randomWall(options){
    var options = options || {};
    var outer = options.outer || false;
    let random = Math.random();
    if (!outer){
        switch(true){
            case random < .05:
                return wallimgs[10];
                break;
            case random < .075:
                return wallimgs[13];
                break;
            case random < .1:
                return wallimgs[11];
                break;
            case random < .105:
                return wallimgs[14];
                break;
            default:
                return wallimgs[2];
                break;
        }
    }else{
        switch(true){
            case random < .05:
                return wallimgs[10];
                break;
            case random < .1:
                return wallimgs[12];
                break;
            case random < .105:
                return wallimgs[14];
                break;
            default:
                return wallimgs[2];
                break;
        }
    }
}

function randomFloor(){
    let random = Math.random();
    switch(true){
        case random < .05:
            return floorimgs[1];
            break;
        case random < .1:
            return floorimgs[2];
            break;
        case random < .15:
            return floorimgs[3];
            break;
        case random < .2:
            return floorimgs[4];
            break;
        case random < .225:
            return floorimgs[5];
            break;
        default:
            return floorimgs[0];
            break;
    }
}
function opposite(direction){
    switch(direction){
        case UP:
            return DOWN;
        case DOWN:
            return UP;
        case LEFT:
            return RIGHT;
        case RIGHT:
            return LEFT;
    }
}

class Room{
    constructor(width,height,x,y){
        this.x = x;
        this.y = y;
        this.roomTime=Date.now();
        this.width=width;
        this.height=height+2;
        this.lpad = this.getlpad();
        this.tileArray=[];
        this.doorTiles =[];
        this.doors = [];
        this.corners = [];
        this.walls = [];
        this.occupiedSpaces = [];
        this.buildDoors();
        this.buildWalls();
        this.positionPlayer();
        this.leftFrom;
    }

    /* =================================== */
    /*            Helper Methods           */
    /* =================================== */
    isOccupiedTile(x,y){
        for(var i =0;i<this.occupiedSpaces.length-1;i++){
            if(this.occupiedSpaces[i][0]==x && this.occupiedSpaces[i][1]==y){
                return true;
            }
        }
        return false;
    }
    hasDoor(direction){
        for(var door of this.doors){
            if(door.direction == direction && door.enabled == true){
                return true;
            }
        }
    }
    getlpad(){
        if(canvas.width > this.width){
            return (canvas.width-(this.width*TS))/2;
        }else{
            return 0;
        }
    }
    reload(){
        this.positionPlayer();
        this.roomTime=Date.now();
    }
    positionPlayer(){
        var doorArray = this.tileArray.filter(tile => tile instanceof DoorTile2);
        if (roomHistory.length>0){
            for(var i = 0; i<doorArray.length;i++){
                if(
                (roomHistory[roomHistory.length-1].leftFrom == UP && doorArray[i].direction == DOWN) ||
                (roomHistory[roomHistory.length-1].leftFrom == DOWN && doorArray[i].direction == UP) ||
                (roomHistory[roomHistory.length-1].leftFrom == LEFT && doorArray[i].direction == RIGHT) ||
                (roomHistory[roomHistory.length-1].leftFrom == RIGHT && doorArray[i].direction == LEFT)){
                    player.setLocation(doorArray[i].x*TS+.5*TS, doorArray[i].y*TS+.5*TS);
                }
            }
        }
    }
    distanceFromCenter(){
        let a = this.x;
        let b = this.y;
        if (a == 0 && b == 0){ return 1}; 
        return (Math.sqrt( a*a + b*b ));
    }

    /* =================================== */
    /*            Build Methods            */
    /* =================================== */
    buildFloor(){
        for(var x=0; x<this.width; x++){
            for(var y=0; y<=this.height; y++){
                this.tileArray.push(new FloorTile(randomFloor(), 0 , x, y, TS));
            }
        }
    }
    buildWalls(){
        //Builds corners
        this.corners[0] = new Corner(0, 0, this, UPLEFT);
        this.corners[1] = new Corner(this.width-1, 0, this, UPRIGHT);
        this.corners[2] = new Corner(0, this.height, this, DOWNLEFT);
        this.corners[3] = new Corner(this.width-1, this.height, this, DOWNRIGHT);

        //Adds corners to main tile array
        for(var i = 0; i<this.corners.length; i++){
            this.tileArray = this.tileArray.concat(this.corners[i].selfArray);
            this.occupiedSpaces = this.occupiedSpaces.concat(this.corners[i].occupyingSpaces);
        }

        //Adds walls along top and bottom
        for(var w = 0; w < this.width; w++){
            if(!this.isOccupiedTile(w,0)){
                this.walls.push(new Wall(w, 0, this, UP)); 
                this.tileArray = this.tileArray.concat(this.walls[this.walls.length-1].selfArray);
            }
            if(!this.isOccupiedTile(w,this.height)){
                this.walls.push(new Wall(w, this.height, this, DOWN)); 
                this.tileArray = this.tileArray.concat(this.walls[this.walls.length-1].selfArray);
            }
        }

        //Adds walls along left and right
        for(var h = 0; h < this.height; h++){
            if(!this.isOccupiedTile(0,h)){
                this.walls.push(new Wall(0, h, this, LEFT)); 
                this.tileArray = this.tileArray.concat(this.walls[this.walls.length-1].selfArray);            }
            if(!this.isOccupiedTile(this.width-1,h)){
                this.walls.push(new Wall(this.width-1, h, this, RIGHT)); 
                this.tileArray = this.tileArray.concat(this.walls[this.walls.length-1].selfArray);            }
        }
    }


    buildDoors(){

        this.doors[0] = new Door(randomIntFromInterval(1, this.width-2), 0, this, UP);
        this.doors[1] = new Door(randomIntFromInterval(1, this.width-2), this.height, this, DOWN);
        this.doors[2] = new Door(0,randomIntFromInterval(3, this.height-2), this, LEFT);
        this.doors[3] = new Door(this.width-1, randomIntFromInterval(3, this.height-2), this, RIGHT);

        //Enable door player entered from
        if(roomHistory.length > 0){
            for(var door of this.doors){
                if(door.direction == opposite(roomHistory[roomHistory.length-1].leftFrom)){
                    door.enabled = true;
                }
            }
        }

        //Enable doors randomly based on how far from origin room current room is
        for( var i = 0; i<this.doors.length; i++){
            let random = Math.random() * this.distanceFromCenter();
            if(random<1){
                this.doors[i].enabled = true;
            }
        }

        //Disables door if adjacent discovered room lacks a sister door in that spot
        if(this.getRoom(this.x-1, this.y) != false && !this.getRoom(this.x-1, this.y).hasDoor(RIGHT) ){
            this.doors[2].enabled = false;
        }
        if(this.getRoom(this.x+1, this.y) != false && !this.getRoom(this.x+1, this.y).hasDoor(LEFT)){
            this.doors[3].enabled = false;
        }
        if(this.getRoom(this.x, this.y+1) != false && !this.getRoom(this.x, this.y+1).hasDoor(DOWN)){
            this.doors[0].enabled = false;
        }
        if(this.getRoom(this.x, this.y-1) != false && !this.getRoom(this.x, this.y-1).hasDoor(UP)){
            this.doors[1].enabled = false;
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

    buildItems(){
        let floorArray = this.tileArray.filter(tile => tile instanceof FloorTile && tile.enabled == true);
        for(var i = 0; i<floorArray.length;i++){
            var random = randomIntFromInterval(1,1000);
            switch(true){
                case random < 10:
                    //Chest
                    this.tileArray.push(new Item(itemimgs[0], 0, floorArray[i].x, floorArray[i].y, TS, true));
                break;
                case random < 20:
                    //Potion
                    this.tileArray.push(new Item(itemimgs[1], 0, floorArray[i].x, floorArray[i].y, TS, false));
                break;
            break;
            }
        }
    }
    
    drawRoom = function(){
        ctx.translate(activeRoom.lpad, 0);
        var layer0 = this.tileArray.filter(tile => tile.layer == 0);
        var layer1 = this.tileArray.filter(tile => tile.layer == 1);
        var layer2 = this.tileArray.filter(tile => tile.layer == 2);
        var layer3 = this.tileArray.filter(tile => tile.layer == 3);


        for( var i = 0; i<layer0.length; i++){
            layer0[i].draw();
        }
        for( var i = 0; i<layer1.length; i++){
            layer1[i].draw();
        }
        for( var i = 0; i<layer2.length; i++){
            layer2[i].draw();
        }
        player.draw();
        for( var i = 0; i<layer3.length; i++){
            layer3[i].draw();
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    getRoom(x,y){
        for(var i = 0; i<roomHistory.length;i++){
            if(roomHistory[i].x == x && roomHistory[i].y == y){
                return roomHistory[i];
            }
        }
        return false;
    }

    nextRoom(){
        var doorTiles = this.doorTiles;
        for(var i = 0;i<doorTiles.length;i++){
            if(doorTiles[i].inArea(player.x, player.y)){
                this.leftFrom = doorTiles[i].direction;
            } 
        }
        roomHistory.push(activeRoom);
        switch(this.leftFrom){
            case UP:
                if(this.getRoom(this.x, this.y+1)){
                    activeRoom = this.getRoom(this.x, this.y+1);
                    activeRoom.reload();
                }else{
                    activeRoom = new Room(randomIntFromInterval(5,10),randomIntFromInterval(3,7), activeRoom.x, activeRoom.y+1);
                    uniqueRooms++;
                }
                break;
            case DOWN:
                if(this.getRoom(this.x, this.y-1)){
                    activeRoom = this.getRoom(this.x, this.y-1);
                    activeRoom.reload();
                }else{
                    activeRoom = new Room(randomIntFromInterval(5,10),randomIntFromInterval(3,7), activeRoom.x, activeRoom.y-1);
                    uniqueRooms++;
                }
                break;
            case LEFT:
                if(this.getRoom(this.x-1, this.y)){
                    activeRoom = this.getRoom(this.x-1, this.y);
                    activeRoom.reload();
                }else{
                    activeRoom = new Room(randomIntFromInterval(5,10),randomIntFromInterval(3,7), activeRoom.x-1, activeRoom.y);
                    uniqueRooms++;
                }
                break;
            case RIGHT:
                if(this.getRoom(this.x+1, this.y)){
                    activeRoom = this.getRoom(this.x+1, this.y);
                    activeRoom.reload();
                }else{
                    activeRoom = new Room(randomIntFromInterval(5,10),randomIntFromInterval(3,7), activeRoom.x+1, activeRoom.y);
                    uniqueRooms++;
                }
            break;
        }
    }
}

var activeRoom = new Room(randomIntFromInterval(5,8),randomIntFromInterval(3,5), 0, 0);




// The main game loop
var lastTime;
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    handleInput(dt);
    activeRoom.drawRoom();
    lastTime = now;
    playerLocation.textContent=Math.floor(player.x) + ", " + Math.floor(player.y);
    //torch_sprite.update();
    //torch_sprite.render();
    requestAnimationFrame(main);
};


