class Structure{
    constructor(x, y, room){
        this.x = x;
        this.y = y;
        this.room = room;
        this.occupyingSpaces = [[x,y]];
        this.selfArray = [];
    }

    getOrigin(){
        return [this.x, this.y];
    }
}

class Door extends Structure{
    constructor(x, y, room, direction, enabled = false){
        super(x,y,room,direction);
        this.direction = direction;
        this.enabled = enabled;
        this.build();
    }

    build(){
        switch(this.direction){
            case DOWN:
                this.selfArray.push(new WallTile2(wallimgs[15], 3 , this.x, this.y-1, { obstructing:false }));//Archway
                this.selfArray.push(new FloorTile(randomFloor(), 0, this.x, this.y-1, { })); //Floor Tile doormat
                this.selfArray.push(new DoorTile2(randomFloor(), 0, this.x, this.y, DOWN, this.room));
                break;
            case UP:
                this.selfArray.push(new WallTile2(wallimgs[15], 3 , this.x, this.y, { obstructing:false }));//Archway
                this.selfArray.push(new FloorTile(randomFloor(), 0, this.x, this.y+2, { }));//Floor Tile doormat
                this.selfArray.push(new DoorTile2(randomFloor(), 0, this.x, this.y+1, UP, this.room));
                break;
            case LEFT:
                this.selfArray.push( new WallTile2(wallimgs[17], 2, this.x, this.y-1, { obstructing:true, hitboxLeft:true}));
                this.selfArray.push( new WallTile2(wallimgs[19], 3, this.x, this.y, { obstructing: false}));
                this.selfArray.push( new FloorTile(randomFloor(), 0, this.x, this.y-1));
                this.selfArray.push( new FloorTile(randomFloor(), 0, this.x+1, this.y));//Floor Tile doormat
                this.selfArray.push(new DoorTile2(randomFloor(), 0, this.x, this.y, LEFT, this.room ));
                break;
            case RIGHT:
                this.selfArray.push( new WallTile2(wallimgs[16], 2, this.x, this.y-1, { hitboxRight:true, obstructing:true}));
                this.selfArray.push( new WallTile2(wallimgs[18], 3, this.x, this.y, { obstructing: false}));
                this.selfArray.push( new FloorTile(randomFloor(), 0, this.x, this.y-1));
                this.selfArray.push( new FloorTile(randomFloor(), 0, this.x-1, this.y));//Floor Tile doormat
                this.selfArray.push(new DoorTile2(randomFloor(), 0, this.x, this.y, RIGHT, this.room ));
                break;
        }
        this.occupyingSpaces = this.selfArray.map(i => [i.x,i.y]);
    }
}

class Corner extends Structure{
    constructor(x, y, room, direction){
        super(x,y,room,direction);
        this.direction = direction;
        this.build();
    }

    build(){
        switch(this.direction){
            case UPLEFT:
                this.selfArray.push(new WallTile2(wallimgs[6], 2 , this.x, this.y, {obstructing:true}));
                this.selfArray.push(new WallTile2(wallimgs[2], 1 , this.x, this.y+1, {obstructing:true}));
                this.selfArray.push(new WallTile2(wallimgs[1], 1 , this.x, this.y+1, {obstructing:true}));
                break;
            case UPRIGHT:
                this.selfArray.push(new WallTile2(wallimgs[5], 2 , this.x, this.y, {obstructing:true}));
                this.selfArray.push(new WallTile2(wallimgs[2], 1 , this.x, this.y+1, {obstructing:true}));
                this.selfArray.push(new WallTile2(wallimgs[0], 1 , this.x, this.y+1, {obstructing:true}));
                break;
            case DOWNLEFT:
                this.selfArray.push(new WallTile2(wallimgs[20], 3 , this.x, this.y, {obstructing:true}));
                this.selfArray.push(new WallTile2(wallimgs[3], 3 , this.x, this.y-1, { obstructing:true, hitboxLeft:true}));
                this.selfArray.push(new FloorTile(randomFloor(), 0 , this.x, this.y-1));
                break;
            case DOWNRIGHT:
                this.selfArray.push(new WallTile2(wallimgs[21], 3 , this.x, this.y, {obstructing:true}));
                this.selfArray.push(new WallTile2(wallimgs[4], 3 , this.x, this.y-1, {obstructing:true, hitboxRight:true}));
                this.selfArray.push(new FloorTile(randomFloor(), 0 , this.x, this.y-1));
                break;
        }
        this.occupyingSpaces = this.selfArray.map(i => [i.x,i.y]);
        this.room.occupiedSpaces = this.room.occupiedSpaces.concat(this.occupyingSpaces);
    }
}

class Wall extends Structure{
    constructor(x, y, room, direction){
        super(x,y,room,direction);
        this.direction = direction;
        this.build();
    }

    build(){
        switch(this.direction){
            case DOWN:
                this.selfArray.push(new FloorTile(randomFloor(), 0 , this.x, this.y-1));
                this.selfArray.push(new WallTile2(wallimgs[7], 3 , this.x, this.y-1, {},true));
                this.selfArray.push(new WallTile2(randomWall({outer: true}), 3 , this.x, this.y, {obstructing:true},true));
                break;
            case UP:
                this.selfArray.push(new WallTile2(wallimgs[7], 3 , this.x, this.y, {},true));
                this.selfArray.push(new WallTile2(randomWall(), 2 , this.x, this.y+1, {obstructing:true},true));
                break;
            case LEFT:
                this.selfArray.push(new WallTile2(wallimgs[1], 3 , this.x, this.y, {obstructing:true, hitboxLeft:true},true));
                this.selfArray.push(new FloorTile(randomFloor(), 0 , this.x, this.y));
                break;
            case RIGHT:
                this.selfArray.push(new WallTile2(wallimgs[0], 3 , this.x, this.y, {obstructing:true, hitboxRight:true},true));
                this.selfArray.push(new FloorTile(randomFloor(), 0 , this.x, this.y));
                break;
        }
        this.occupyingSpaces = this.selfArray.map(i => [i.x,i.y]);
        this.room.occupiedSpaces = this.room.occupiedSpaces.concat(this.occupyingSpaces);
    }
}
class WallColumn extends Structure{
    constructor(x, y, room, direction){
        super(x,y,room);
        this.direction = direction;
        this.build();
    }

    build(){
        switch (this.direction){
            case UP:
                this.selfArray.push(new WallTile2(wallimgs[22], 3, this.x, this.y, {obstructing:true}));
                this.selfArray.push(new WallTile2(wallimgs[23], 2, this.x, this.y+1, {obstructing:true}));
                this.selfArray.push(new WallTile2(wallimgs[24], 0, this.x, this.y+2, {obstructing:true, column:true}));
            break;
            case DOWN:
                this.selfArray.push(new FloorTile(randomFloor(), 0, this.x, this.y-1));
                this.selfArray.push(new WallTile2(wallimgs[22], 3, this.x, this.y-1, {}));
                this.selfArray.push(new WallTile2(wallimgs[23], 2, this.x, this.y, {obstructing:true}));
                break;
        }

        this.occupyingSpaces = this.selfArray.map(i => [i.x,i.y]);
    }
}
class TorchWall extends Structure{
    constructor(x, y, room, direction){
        super(x,y,room);
        this.torchImage = new Image();
        this.room = room;
        this.direction = direction;
        this.sprite = sprite({
            context: ctx,
            width: 64,
            height: 16,
            image: this.torchImage,
            numberOfFrames: 4,
            sizescale: .065,
            defaultSize:true
        });
        this.build();
    }

    build(){
        switch(this.direction){
            case UP:
                this.torchImage.src = 'img/sprites/torch.png';
                this.sprite.x = this.x*TS;
                this.sprite.y = (this.y+1)*TS;
                this.selfArray.push(new WallTile2(wallimgs[7], 3 , this.x, this.y, {}));
                this.selfArray.push(new WallTile2(wallimgs[2], 1 , this.x, this.y+1, {obstructing:true}));
                this.room.sprites.push(this);
                break;
            case LEFT:
                this.torchImage.src = 'img/sprites/torch-side-left.png';
                this.sprite.x = this.x*TS;
                this.sprite.y = this.y*TS;
                this.selfArray.push(new WallTile2(wallimgs[1], 3 , this.x, this.y, {obstructing:true, hitboxLeft:true}));
                this.selfArray.push(new FloorTile(randomFloor(), 0 , this.x, this.y));
                this.room.sprites.push(this);
                break;
            case RIGHT:
                this.torchImage.src = 'img/sprites/torch-side-right.png';
                this.sprite.x = this.x*TS;
                this.sprite.y = this.y*TS;
                this.selfArray.push(new WallTile2(wallimgs[0], 3 , this.x, this.y, {obstructing:true, hitboxRight:true}));
                this.selfArray.push(new FloorTile(randomFloor(), 0 , this.x, this.y));
                this.room.sprites.push(this);
                break;
        }
        this.occupyingSpaces = this.selfArray.map(i => [i.x,i.y]);
        this.room.occupiedSpaces = this.room.occupiedSpaces.concat(this.occupyingSpaces);
    }
}

class FloorColumn extends Structure{
    constructor(x, y, room){
        super(x,y,room);
        this.build();
    }

    build(){
        if(isOccupiedTile(this.x,this.y-1,this.room)){
            this.room.tileArray.push(new FloorTile(randomFloor(), 0 , this.x, this.y, TS));
            return;
        }
        this.selfArray.push(new FloorTile(randomFloor(), 0 , this.x, this.y-1));
        this.selfArray.push(new FloorTile(randomFloor(), 0 , this.x, this.y));
        this.selfArray.push(new WallTile2(wallimgs[25], 2, this.x, this.y, {obstructing:true, column: true}));
        this.selfArray.push(new WallTile2(wallimgs[26], '*', this.x, this.y-1, {}));
        this.selfArray.push(new WallTile2(wallimgs[27], 3, this.x, this.y-2, {}));

        this.occupyingSpaces = [[this.x,this.y],[this.x,this.y-1]];
        this.room.occupiedSpaces = this.room.occupiedSpaces.concat(this.occupyingSpaces);
        this.room.tileArray = this.room.tileArray.concat(this.selfArray);
    }
}

class Pit extends Structure{
    constructor(x, y, room){
        super(x,y, room);
        this.build();
    }

    build(){
        this.selfArray.push(new PitTile( 0, this.x, this.y, this.room));
        let validSpots = this.getValidSpots();
        for(var validSpot of validSpots){
            let random = Math.random();
            if(random > .35){
            this.selfArray.push(new PitTile( 0, validSpot[0], validSpot[1], this.room));
            }
        }

        this.occupyingSpaces = this.selfArray.map(i => [i.x,i.y]);
        this.room.occupiedSpaces = this.room.occupiedSpaces.concat(this.occupyingSpaces);
        this.room.tileArray = this.room.tileArray.concat(this.selfArray);
    }

    getValidSpots(){
        let valid = [];
        if(!isOccupiedTile(this.x-1,this.y,this.room)){
            valid.push([this.x-1,this.y]);
        }
        if(!isOccupiedTile(this.x,this.y-1,this.room)){
            valid.push([this.x,this.y-1]);
        }
        if(!isOccupiedTile(this.x+1,this.y,this.room)){
            valid.push([this.x+1,this.y]);
        }
        if(!isOccupiedTile(this.x,this.y+1,this.room)){
            valid.push([this.x,this.y+1]);
        }
        return valid;
    }
}

function isOccupiedTile(x,y, room){
    for(var i =0;i<room.occupiedSpaces.length;i++){
        if(room.occupiedSpaces[i][0]==x && room.occupiedSpaces[i][1]==y){
            return true;
        }
    }
    return false;
}