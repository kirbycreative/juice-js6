const cdn_url = "https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js";

import Cache from '../data/cache.mjs';
const cache = new Cache('tpl');

import Path from '../Util/path.mjs';
import Parser from './parser.mjs';

import xhr from '../request/xhr.mjs';
import Request from '../request/request.mjs';
import EventEmitter from '../event/emitter.mjs';


function convertStrToTpl( str ){
    return eval('`'+str+'`');
}

class TplList {
    constructor( listArr, tplStr ){

    }
}


class TplStore {
    static instances = {};

    static get( name ){
        console.log(TplStore.instances);
        return TplStore.instances[name];
    }

    static add( name, tpl ){
        TplStore.instances[name] = tpl;
    }

    static has( name ){
        return TplStore.instances[name] ? true : false;
    }
}

class Template extends EventEmitter{
    
    constructor( path ){
        super();
        this.path = path;
        
    }

    async build( tokens ){
        const self = this;
        let raw_html;

        if( cache.has( self.path ) ){
            console.log('Cache OK', self.path );
            raw_html = cache.get( self.path );
        }else{
            console.log('No Cache');
            raw_html = await self.load();
        }

       
        console.log( raw_html );
       // var tpl = Handlebars.compile( raw_html );
       // var processed = tpl( tokens );

        return raw_html;
    }

    async load(){

        const self = this;

        var path = Path.resolve( this.path, '.tpl' );
        const content = await new Request( path ).get();        
        cache.set( self.path, content );
        return content;

    }
    

}

class TemplateTarget extends EventEmitter {

    current = null;
    modifiers = [];
    static instances = [];
    
    constructor( name, dom, options ){
        super();
        if(options.dir) this.dir = options.dir;
        this.name = name;
        this.dom = typeof dom == 'string' ? document.querySelector( dom ) : dom;
        TemplateTarget.instances.push( this );
    }

    addModifier( fn ){
        this.modifiers.push( fn );
    }

    load( path, tokens ){
        const self = this;
        path = Path.resolve( this.dir, path );
        console.log('Target Load', path);
        this.dom.innerHTML = '';
        if( this.current ) this.emit( 'unload', this.current.path );
        this.current = null;

        if(!TplStore.has(path) ) TplStore.add( path, new Template( path ) );
        const tpl = TplStore.get( path );

        console.log(tpl);

        tpl.once('ready', function(){

        });

        let html = tpl.build( tokens ).then( ( html ) => {
            self.emit( 'loaded', tpl.path );

            self.dom.innerHTML = html;
    
            self.current = tpl;
    
            if( self.modifiers.length > 0 ){
                for( let i=0;i<self.modifiers.length;i++){
                    self.modifiers[i]( tpl.path );
                }
            }
    
            self.emit( 'changed', tpl.path );
        });
        

    }

}




class Templates extends EventEmitter {

    targets = {};
    //ready=false;

    constructor( options={} ){
        super('ready');
        const self = this;
        self.dir = options.dir || './';

        if( typeof Handlebars !== 'undefined' ) 
            self.ready = true;
        else{
            initialize(function(){
                console.log('TPL INITIALIZED');
                self.ready = true;
            });
        }
    }

    target( name, dom, options={} ){
        if(!options.dir) options.dir = this.dir;
        if(!this.targets[name]) this.targets[name] = new TemplateTarget( name, dom, options );
        return this.targets[name];
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



function initialize( callback ){

    const hbReady = function(){
        console.log(Handlebars);
        return callback();
    }

    let script = document.createElement('script');
    script.src = cdn_url;
    script.onload = callback;

    document.body.appendChild( script );
    return false;

}

/*** Add Handelbars script and call initialize upon load. ***/



export { Templates as default }