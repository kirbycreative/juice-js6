import AniUtil from './Util.mjs';


class Vector {


    constructor( ){

    }

    distTo(){

    }
}

class Vector2D extends Vector {

    last = { x: null, y: null };
    value = { x: null, y: null };

    constructor( x, y ){
        this.set( x, y );
    }

    set x( x ){
        this.last.x = this.value.x;
        this.value.x = x;
    }

    get x( x ){ return this.value.x; }

    set y( y ){
        this.last.y = this.value.y;
        this.value.y = y;
    }

    get y( y ){ return this.value.y; }

    set( x, y ){
        this.x = x;
        this.y = y;
    }
}

class Vector3D extends Vector {

    last = { x: null, y: null, z: null };
    value = { x: null, y: null, z: null };

    constructor( x, y, z ){
        this.set( x, y, z );
    }

    set x( x ){
        this.last.x = this.value.x;
        this.value.x = x;
    }

    get x( x ){ return this.value.x; }

    set y( y ){
        this.last.y = this.value.y;
        this.value.y = y;
    }

    get y( y ){ return this.value.y; }

    set z( z ){
        this.last.z = this.value.z;
        this.value.z = z;
    }

    get z( z ){ return this.value.z; }

    set( x, y, z ){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}



export { Vector as default, Vector2D, Vector3D }