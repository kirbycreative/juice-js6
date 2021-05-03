import Loader from '../Http/Loader.mjs';

class AssetList {
    _path = null;
    constructor( path ){
        this._path = path;
    }

    loadAll( name, urls ){

        return Loader.loadAll( urls ).then(( assets ) => {
            this[name] = assets;
        });

    }

    load( name, url ){

        return Loader.load( url ).then(( asset ) => {
            this[name] = asset;
        });

    }

    add( name, asset ){
        this[name] = asset;
    }

    get( name ){
        return this[name];
    }
}

class Assets {

    manifest = {};

    constructor(){

    }

    use( path ){
        if( !this[path] ) this[path] = new AssetList(path);
        return this[path];
    }

    get( path ){

    }

}

export default Assets;