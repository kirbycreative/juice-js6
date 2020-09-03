"use strict";

import Path from './core/utils/path.mjs'
import EventEmitter from './core/event/emitter.mjs';

const script = import.meta.url;
console.log("Juice ES6", script);

function JuiceModule( classRef ){
    if( typeof classRef === 'string' ){
        
    }
}

function JuiceCompile( base ){
    this.config = {
        extend: [],
        include: []
    }
}

JuiceCompile.prototype.extends = function( classes ){
    for( let i=0;i<classes.length;i++ ){
        if( typeof classes[i] === 'string' ){

        }
    }
    return this;
}

JuiceCompile.prototype.includes = function(){
    return this;
}

JuiceCompile.prototype.build = function(){

    function extend(){
        const nameIt = (name, compiled ) => ({[name] : class extends compiled {}})[name];

    }
    for( let i=0;i<this.config.extend.length;i++){

    }
    
    for( let i=0;i<this.config.include.length;i++){
        Object.defineProperty( Base, this.config.include[i].name, {
            value: this.config.include[i],
            writable: false
        });
    }

    return this.module;

}

class JuiceJS extends EventEmitter {

    dir = Path.dir( script );
    global = window || global;
    config = {};

    constructor( config={} ){
        super();
        if( this.global.JUICE_CONFIG ){
            this.config = this.global.JUICE_CONFIG;
        }
       
    }

    tpls(){

    }

    expose( variable, ns ){
        this.global[ns] = ns;
    }

    module( mpath, dir ){

        const parts = [ ( dir || this.dir ), 'core', mpath ];
        return new Promise((resolve, reject) => {

            if( Path.ext( mpath ) === undefined ) parts.push('.mjs');
            const fullpath = Path.resolve( ...parts );
            import( fullpath ).then( ( Module ) => {
                resolve(Module.default);


            });
        });
    }

    require( ...mpaths ){

    }

    build( Base, dependaants, constants ){
        var base = new Base( ...dependaants );

    }

    startup(){

    }

}

const juice = new JuiceJS();
juice.expose( juice, 'juice' );

export { juice as default }; 