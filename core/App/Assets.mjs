class AssetList {
    _path = null;
    constructor( path ){
        this._path = path;
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