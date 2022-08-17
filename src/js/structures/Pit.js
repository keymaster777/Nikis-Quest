import Structure from "./Structure";
import PitTile from "../tiles/PitTile";

class Pit extends Structure{
    constructor(x, y, occupiedSpotsInRoom){
        super(x,y);
        this.occupiedSpotsInRoom = occupiedSpotsInRoom
        this.build();
    }


    build(){
        this.selfArray.push(new PitTile(this.x, this.y));
        let validSpots = this.getValidSpots();
        for(var validSpot of validSpots){
            let random = Math.random();
            if(random > .35){
            this.selfArray.push(new PitTile(validSpot[0], validSpot[1]));
            }
        }

        this.occupyingSpaces = this.selfArray.map(i => [i.x,i.y]);
    }

    getValidSpots(){
        let valid = [];
        if(!this.occupiedSpotsInRoom.find(coords => coords[0] == this.x-1 && coords[1] == this.y)){
            valid.push([this.x-1,this.y]);
        }
        if(!this.occupiedSpotsInRoom.find(coords => coords[0] == this.x && coords[1] == this.y-1)){
            valid.push([this.x,this.y-1]);
        }
        if(!this.occupiedSpotsInRoom.find(coords => coords[0] == this.x+1 && coords[1] == this.y)){
            valid.push([this.x+1,this.y]);
        }
        if(!this.occupiedSpotsInRoom.find(coords => coords[0] == this.x && coords[1] == this.y+1)){
            valid.push([this.x,this.y+1]);
        }
        return valid;
    }
}

export default Pit