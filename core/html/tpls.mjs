const cdn_url = "https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js";

import Cache from './cache.mjs';
const cache = new Cache('tpl');

import Path from './utils/path.mjs';
import Parser from './parser.mjs';

class Template {
    
    constructor( path ){
        this.path = path;
        this.load();
    }

    build( tokens ){

        let raw_html = this.load();
        var tpl = Handlebars.compile( raw_html );
        var processed = tpl( tokens );

        return processed;
    }

    load(){

        if( cache.has( this.path ) ){
            console.log('Cache OK', this.path );
            return cache.get( this.path );
        }

        var path =  exports.dir + this.path +'.tpl';
        var content = require('fs').readFileSync(path);

        var head = Parser.head( content );
        var body = Parser.body( content );
        
        cache.set( this.path, body );

        return body;
    }

}


class Templates {

    tpls = {};

    constructor( options ){
        this.dir = options.dir || './';
    }

    use( path, tokens ){
        path = Path.resolve( this.dir, path );
        if(!this.tpls[path]) this.tpls[path] = new Template( path );
        return this.tpls[path];
    }

    load( ...paths ){
        for(var i=0;i<paths.length;i++){
            let path = Path.resolve( this.dir, paths[i] );
            if(!this.tpls[path]) this.tpls[path] = new Template( path );
        }
    }

}

/*** Add Handelbars script and call initialize upon load. ***/

let script = document.createElement('script');
script.src = cdn_url;
script.onload = initialize;

document.appendChild( script );

export { Templates as default }