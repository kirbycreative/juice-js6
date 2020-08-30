const cdn_url = "https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js";

import Cache from '../data/cache.mjs';
const cache = new Cache('tpl');

import Path from '../utils/path.mjs';
import Parser from './parser.mjs';

import EventEmitter from '../event/emitter.mjs';

class TplStore {
    static instances = {};

    static get( name ){
        return TplStore.instances[name];
    }

    static add( name, tpl ){
        TplStore.instances[name] = tpl;
    }

    static has( name ){
        return TplStore.instances[name] ? true : false;
    }
}

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

class TemplateTarget extends EventEmitter {

    current = null;
    modifiers = [];
    static instances = [];
    
    constructor( name, dom ){
        super();
        
        this.name = name;
        this.dom = typeof dom == 'string' ? document.querySelector( dom ) : dom;
        TemplateTarget.instances.push( this );
    }

    addModifier( fn ){
        this.modifiers.push( fn );
    }

    load( path, tokens ){

        path = Path.resolve( this.dir, path );

        this.dom.innerHTML = '';
        if( this.current ) this.emit( 'unload', this.current.path );
        this.current = null;

        if(!TplStore.has(path) ) TplStore.add( new Template( path ) );
        const tpl = TplStore.get( path );

        let html = tpl.build( tokens );
        this.emit( 'loaded', tpl.path );

        this.dom.innerHTML = html;

        this.current = tpl;

        if( this.modifiers.length > 0 ){
            for( let i=0;i<this.modifiers.length;i++){
                this.modifiers[i]( tpl.path );
            }
        }

        this.emit( 'changed', tpl.path );

    }

}


class Templates {

    targets = {};

    constructor( options={} ){
        this.dir = options.dir || './';
    }

    target( name, dom, options ){
        if(!targets[name]) targets[name] = new TemplateTarget( name, dom, options );
        return targets[name];
    }

    use( path, tokens ){
        path = Path.resolve( this.dir, path );
        if(!TplStore.has(path) ) TplStore.add( new Template( path ) );
        return TplStore.get( path );
    }

    load( ...paths ){
        for(var i=0;i<paths.length;i++){
            const path = Path.resolve( this.dir, paths[i] );
            if(!TplStore.has( path ) ) TplStore.add( new Template( path ) );
        }
    }

}

function initialize(){
    console.log(Handlebars);
}

/*** Add Handelbars script and call initialize upon load. ***/

let script = document.createElement('script');
script.src = cdn_url;
script.onload = initialize;

document.body.appendChild( script );

export { Templates as default }