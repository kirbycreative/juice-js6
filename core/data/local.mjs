var store = window.localStorage;

var formatValue = function( v, type ){
    switch( type ){
        case 'int':
        v = parseInt( v );
        break;
    }
    return v;
}

class LocalStorage {

    prefix = null;

    constructor( prefix ){
        this.prefix = prefix;
    }

    get( key, type ){
        if( this.prefix ) key = this.prefix+key;
        var v = store.getItem( key );
        if( v && type ) v = formatValue( v, type );
        return v;
    };

    set( key, value ){
        if( this.prefix ) key = this.prefix+key;
        store.setItem( key, value );
        return false;
    };

    remove( key ){
        if( this.prefix ) key = this.prefix+key;
        store.removeItem( key );
        return false;
    };

}

export { LocalStorage as default }