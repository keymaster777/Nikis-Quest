class Structure{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.occupyingSpaces = [];
        this.selfArray = [];
    }

    getOrigin(){
        return [this.x, this.y];
    }
}

export default Structure