import LocalStorage from './local.mjs';

const storage = new LocalStorage();
const defined = [];

class Cache {

    constructor( path ){
        this.path = 'cache:'+path;

    }


    set( k, v, t ){
        storage.set( k, v );
        defined.push( k );
    }

    get( k, t ){
        return storage.get( k, t );
    }

    clear( k ){
        storage.remove( k );
    }

    has( v ){
        return defined.indexOf(v) !== -1;
    }

  

}

export { Cache as default };