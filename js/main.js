var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
const TS = 75;
const UP = "up";
const DOWN = "down";
const LEFT = "left";
const RIGHT = "right";
var roomHistory=[];
var uniqueRooms = 0;
canvas.width = TS*11;
canvas.height = TS*9;
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

function randomWall(outer = false){
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

class Room{
    constructor(width,height,x,y, entryDoor = false){
        this.x = x;
        this.y = y;
        this.roomTime=Date.now();
        this.width=width;
        this.height=height+2;
        this.lpad = this.getlpad();
        this.entryDoor = entryDoor;
        this.tileArray=[];
        this.directionsLeft=[UP,DOWN,LEFT,RIGHT];
        this.oneWayBlockedDoors=[];
        this.doorTile;
        this.doorArray;
        this.buildFloor();
        this.buildWalls();
        this.buildDoors(this.directionsLeft);
        this.positionPlayer();
        this.preDraw();
        this.buildItems();
        this.leftFrom;
    }

    TS = 75;

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
        var doorArray = this.tileArray.filter(tile => tile instanceof DoorTile);
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
    buildFloor(){
        for(var x=0; x<this.width; x++){
            for(var y=0; y<=this.height; y++){
                this.tileArray.push(new FloorTile(randomFloor(), 0 , x, y, TS));
            }
        }
    }

    buildWalls(){
        var tileArray = this.tileArray;
        var numOfFloorTiles = tileArray.length;
        for (var x=0; x<numOfFloorTiles; x++){

            if (!this.specialWall(tileArray[x], tileArray, x)){

                if(tileArray[x].x == 0){
                    tileArray.push(new WallTile(wallimgs[1], 1, tileArray[x].x, tileArray[x].y, TS, { obstructing: true, hitboxLeft:true })); 
                }
                if(tileArray[x].x == this.width-1){
                    tileArray.push(new WallTile(wallimgs[0], 1, tileArray[x].x, tileArray[x].y, TS, { obstructing: true, hitboxRight:true })); 
                }
                if(tileArray[x].y == 0){
                    tileArray[x] = new WallTile(wallimgs[7], 1 , tileArray[x].x, tileArray[x].y, TS, { obstructing: true });
                }
                if(tileArray[x].y == 1){
                    tileArray[x] = new WallTile(randomWall(), 0 , tileArray[x].x, tileArray[x].y, TS, { obstructing: true });
                }
                if(tileArray[x].y == this.height){
                    tileArray[x] = new WallTile(randomWall(true), 2 , tileArray[x].x, tileArray[x].y, TS, { obstructing: true }); //Bottom
                }
                if(tileArray[x].y == this.height-1){
                    tileArray.push(new WallTile(wallimgs[7], 2 , tileArray[x].x, tileArray[x].y, TS, { obstructing: false })); //bottom Cap
                }
            }
        }
    }

    specialWall(tile, tileArray, position){
        if (tile.x == 0 && tile.y == 0){ 
            tileArray[position] = new WallTile(wallimgs[6], 2 , tileArray[position].x, tileArray[position].y, TS, { obstructing: true});
            return true;
        }
       
        if (tile.x == this.width-1 && tile.y == 0){ 
            tileArray[position] = new WallTile(wallimgs[5], 2 , tileArray[position].x, tileArray[position].y, TS, { obstructing: true });
            return true;
        }
        if (tile.x == this.width-1 && tile.y == this.height-1){ 
            tileArray.push(new WallTile(wallimgs[4], 2 , tileArray[position].x, tileArray[position].y, TS, { obstructing: true, hitboxRight:true }));
            return true;
        }
        if (tile.x == 0 && tile.y == this.height-1){ 
            tileArray.push(new WallTile(wallimgs[3], 2 , tileArray[position].x, tileArray[position].y, TS, { obstructing: true, hitboxLeft:true }));
            return true;
        }
    }
    buildDoors(directionsLeft){
        var tileArray = this.tileArray;
        //Adds guaranteed door at entrance side of new room from exit side of old room
        if(this.entryDoor){
            this.buildOneDoor(this.entryDoor);
            directionsLeft = directionsLeft.filter(direction => direction != this.entryDoor)
        }

        if(this.getRoom(this.x-1, this.y) != false && this.getRoom(this.x-1, this.y).directionsLeft.includes(RIGHT)){
            directionsLeft = directionsLeft.filter(direction => direction != LEFT);
            this.oneWayBlockedDoors.push(LEFT);
        }
        if(this.getRoom(this.x+1, this.y) !=false && this.getRoom(this.x+1, this.y).directionsLeft.includes(LEFT)){
            directionsLeft = directionsLeft.filter(direction => direction != RIGHT);
            this.oneWayBlockedDoors.push(RIGHT);
        }
        if(this.getRoom(this.x, this.y+1) !=false && this.getRoom(this.x, this.y+1).directionsLeft.includes(DOWN)){
            directionsLeft = directionsLeft.filter(direction => direction != UP);
            this.oneWayBlockedDoors.push(UP);
        }
        if(this.getRoom(this.x, this.y-1) !=false && this.getRoom(this.x, this.y-1).directionsLeft.includes(UP)){
            directionsLeft = directionsLeft.filter(direction => direction != DOWN);
            this.oneWayBlockedDoors.push(DOWN);
        }
        for(var i = 0; i<Math.floor(4/this.distanceFromCenter());i++){
            var index = randomIntFromInterval(0,directionsLeft.length-1);
            this.buildOneDoor(directionsLeft[index]);
            directionsLeft = directionsLeft.filter(direction => direction != directionsLeft[index] );
        }
        this.directionsLeft = directionsLeft;
        this.doorArray = tileArray.filter(tile => tile instanceof DoorTile);
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
    distanceFromCenter(){
        let a = this.x;
        let b = this.y;
        if (a == 0 && b == 0){ return 1}; 
        return (Math.sqrt( a*a + b*b ));
    }
    buildOneDoor(direction){
        var tileArray = this.tileArray;
        if (direction){
            switch(direction){
            case UP:
                tileArray.push( new DoorTile(floorimgs[0], 0, randomIntFromInterval(1, this.width-2), 1, TS, UP ));
                break;
            case DOWN:
                tileArray.push( new DoorTile(floorimgs[0], 0, randomIntFromInterval(1, this.width-2), this.height, TS, DOWN ));
                break;
            case LEFT:
                tileArray.push( new DoorTile(floorimgs[0], 0, 0, randomIntFromInterval(2, this.height-2), TS, LEFT ));
                break;
            case RIGHT:
                tileArray.push( new DoorTile(floorimgs[0], 0, this.width-1, randomIntFromInterval(2, this.height-2), TS, RIGHT ));
                break;
            }
        }
    }
    
    preDraw(){
        for( var i = 0; i<this.doorArray.length; i++){
            this.doorArray[i].preDraw(this);
        }
    }
    
    drawFloor = function(){
        ctx.translate(activeRoom.lpad, 0);
        var layer0 = this.tileArray.filter(tile => tile.layer == 0);
        var layer1 = this.tileArray.filter(tile => tile.layer == 1);
        var layer2 = this.tileArray.filter(tile => tile.layer == 2);


        for( var i = 0; i<layer0.length; i++){
            layer0[i].draw();
        }
        for( var i = 0; i<layer1.length; i++){
            layer1[i].draw();
        }
        player.draw();
        for( var i = 0; i<layer2.length; i++){
            layer2[i].draw();
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
        var doorArray = this.doorArray;
        for(var i = 0;i<doorArray.length;i++){
            if(doorArray[i].inArea(player.x, player.y)){
                this.leftFrom = doorArray[i].direction;
            } 
        }

        roomHistory.push(activeRoom);
        switch(this.leftFrom){
            case UP:
                if(this.getRoom(this.x, this.y+1)){
                    activeRoom = this.getRoom(this.x, this.y+1);
                    activeRoom.reload();
                }else{
                    activeRoom = new Room(randomIntFromInterval(5,8),randomIntFromInterval(2,5), activeRoom.x, activeRoom.y+1, DOWN);
                    uniqueRooms++;
                }
                break;
            case DOWN:
                if(this.getRoom(this.x, this.y-1)){
                    activeRoom = this.getRoom(this.x, this.y-1);
                    activeRoom.reload();
                }else{
                    activeRoom = new Room(randomIntFromInterval(5,8),randomIntFromInterval(2,5), activeRoom.x, activeRoom.y-1, UP);
                    uniqueRooms++;
                }
                break;
            case LEFT:
                if(this.getRoom(this.x-1, this.y)){
                    activeRoom = this.getRoom(this.x-1, this.y);
                    activeRoom.reload();
                }else{
                    activeRoom = new Room(randomIntFromInterval(5,8),randomIntFromInterval(2,5), activeRoom.x-1, activeRoom.y, RIGHT );
                    uniqueRooms++;
                }
                break;
            case RIGHT:
                if(this.getRoom(this.x+1, this.y)){
                    activeRoom = this.getRoom(this.x+1, this.y);
                    activeRoom.reload();
                }else{
                    activeRoom = new Room(randomIntFromInterval(5,8),randomIntFromInterval(2,5), activeRoom.x+1, activeRoom.y, LEFT);
                    uniqueRooms++;
                }
            break;
        }
    }
}

var activeRoom = new Room(randomIntFromInterval(5,8),randomIntFromInterval(2,5), 0, 0);




// The main game loop
var lastTime;
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    ctx.fillStyle = "#222222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    handleInput(dt);
    activeRoom.drawFloor();
    lastTime = now;
    playerLocation.textContent=Math.floor(player.x) + ", " + Math.floor(player.y);
    //torch_sprite.update();
    //torch_sprite.render();
    requestAnimationFrame(main);
};




