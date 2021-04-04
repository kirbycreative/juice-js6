class ValueHistory {

    values = [];
    MAXLEN = 10;
    constructor( len ){
        this.MAXLEN = len;
    }

    add( ...values ){
        this.values.unshift( ...values );
        if( this.values.length > this.MAXLEN ) {
            this.values.splice( this.MAXLEN-1 );
        }
    }

    get( index ){
        return this.values[index];
    }

}

class Numeric {

    #value = undefined;
    #history = new ValueHistory();

    constructor( v ){
        super( v );
        this.#value = v;
    }

    set value( v ){
        this.#history.add(this.#value);
        this.#value = v;
    }

    get value(){
        return this.#value;
    }

    valueOf(){
        return this.#value;
    }

}


class Vector2D {

    defined = {};
    value = { x: 0, y: 0 };
    last = { x: 0, y: 0 };
    round = false;

    constructor( x, y ){
        if( x ) this.x = x; 
        if( y ) this.y = y; 
    }

    get x(){
        return this.value.x;
    }

    set x( x ){
        if( this.value.x === x ) return false;
        this.last.x = this.round ? this.last.x == (0.5 + this.value.x) | 0  : this.value.x;
        this.value.x = x;
        this._changed = this.round ? ( this.last.x == (0.5 + x) | 0 ? false : true ) : true;
        return x;
    }

    get y(){
        return this.value.y;
    }

    set y( y ){
        if( this.value.y === y ) return false;
        this.last.y = this.round ? this.last.y == (0.5 + this.value.y) | 0  : this.value.y;
        this.value.y = y;
        this._changed = this.round ? ( this.last.y == (0.5 + y) | 0 ? false : true ) : true;
        return x;
    }

    get changed(){
        if(this._changed){
            this._changed = false;
            return true;
        }
        return false;
    }


}