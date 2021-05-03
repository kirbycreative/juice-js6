import Path from './core/Util/Path.mjs';
import EventEmitter from './core/event/Emitter.mjs';
import ObjectUtil from './core/Util/Object.mjs';
import Router from './core/App/Router.mjs';
import Loader from '../juice/core/Http/Loader.mjs';
import Global from './core/Data/Global.mjs';

const script = Path.parse( import.meta.url );
console.log("Juice ES6", script);

class JuiceBlender {

    constructor( ...mixins ){

    
        class Mix {}

        // Programmatically add all the methods and accessors
        // of the mixins to class Mix.
        for (let mixin of mixins) {
            //Copy Static Properties
            JuiceBlender.copy(Mix, mixin);
            //Copy Prototype Properties
            JuiceBlender.copy(Mix.prototype, mixin.prototype);
        }

        return Mix;

    }

    static copy(target, source) {
        for (let key of Reflect.ownKeys(source)) {
            if (key !== "constructor" && key !== "prototype" && key !== "name") {
                let desc = Object.getOwnPropertyDescriptor( source, key );
                Object.defineProperty( target, key, desc );
            }
        }
    }
    
}

class JuiceModule {

    extends = [];
    includes = [];
    Super = null;

    constructor( name ){
        this.name = name;
    }

    extend( ...modules ){
        for( let i=0;i<modules.length;i++ ){
            this.extends.push( modules[i] );
        }
        return this;
    }

    include( ...modules ){
        for( let i=0;i<modules.length;i++ ){
            this.includes.push( modules[i] );
        }
        return this;
    }

    compile(){
        const self = this;
       
        const SuperClass = new JuiceBlend( ...this.extends );
      
        class ExtendedBase extends Base {

            constructor( ...args ){

                super( ...args );

                for( let i=0;i<self.includes.length;i++){
                    Object.defineProperty( this, self.includes[i].name, {
                        value: self.includes[i]( ...args ),
                        writable: false
                    });
                }

                JuiceBlender.copy( this, SuperClass );

            }
        }

        return ExtendedBase;
    }
}

class JuiceLoader extends EventEmitter {

    constructor( paths ){

    }




}


class JuiceJS extends EventEmitter {

    config = {};
    manifest = {};
    paths = { 
        juice: script.dir, 
        root: script.url.origin,
        modules: {
            core: './core'
        }
    };

    global = window || global;

    router = null;
    
    static Module = JuiceModule;
    static Blender = JuiceBlender;

    load = Loader.load;
    loadAll = Loader.loadAll;

    constructor( config=null, global=false ){

        super( );

        if( config ) ObjectUtil.merge( config, this.config, true );
        if( this.global.JUICE_CONFIG ) ObjectUtil.merge( this.global.JUICE_CONFIG, this.config, true );
        if( this.config.paths ) ObjectUtil.merge( this.config.paths, this.paths, true );
        
        console.log(this.paths);

        this.moduleRouter = new Router();

        if( global ) this.global.juice = this;
        Global.juice = this;
        console.log(Global);
        this.initialize();

    }

    expose( variable, ns ){
        this.global[ns] = variable;
    }

    async require( ...modules ){
        const self = this;
        return Promise.all( modules.map( module => this.module( module ) ) ).then( ( required ) => {
            const resp = {};
            for( let i=0;i<required.length;i++ ){
                ObjectUtil.merge( required[i], resp );                
            }
            return resp;
        });
    }

    async moduleAsync( mpath, dir ){
        return this.module( mpath, dir );
    }

    async module( source, dir = null ){

        const self = this;
        const parts = source.split('/');

        if( !dir && Object.keys( this.paths.modules ).indexOf( parts[0] ) !== -1 ){
            dir = parts.shift();
            source = parts.join('/');
        }else{
            dir = 'core';
        }
    

        let features = [];
        let [ moduleSource, featureSource = 'default' ] = source.split('::');        

        if( featureSource.indexOf('{') !== -1 ){
            //if featureSource is in {}
            features = featureSource.split('{').pop().split('}').shift().split(',').map( f => f.trim() );
        }else{
            //if No feature (default) or feature is single
            features = [featureSource];
        }

        features = features.map(( f ) => {
            let [ path, alias ] = f.split(' as ');
            return { path: path, alias: alias };
        });

        let [ modulePath, moduleAlias ] = moduleSource.split(' as ');

        if( dir ){
            modulePath = Path.resolve( dir, modulePath );
        }


        return new Promise((resolve, reject) => {

            function compile( Module ){

                let resp = {};

                console.log(Module);

                if( features.length ){
                    if( features.length == 1 && features[0].path == 'default' ){
                        if( moduleAlias && !features[0].alias ){
                            resp = Module.default;
                        }else if( features[0].alias ){
                            resp = { [features[0].alias]: Module[features[0].path] }
                        }else if( !moduleAlias && !features[0].alias ){
                            resp = { [features[0].path]: Module[features[0].path] }
                        }
                    }else{
                        for(const { path, alias } of features ){
                            resp[alias || Module[path].name || path] = Module[path];
                        }
                    }
                }                
                console.log(resp)
                resolve( moduleAlias ? { [moduleAlias]: resp } : resp );

            }

            if( self.manifest[modulePath] ){

                compile( self.manifest[modulePath] );

            }else{
            
                import( this.moduleRouter.route( modulePath ) ).then( ( Module ) => {
                    self.manifest[modulePath] = Module;                
                    compile( Module );
                }).catch( reject );

            }
           
            return false;
        });

    }



    initialize(){

        const moduleRewrite = ( rewrite ) => {
            return rewrite + '.mjs';
        }

        this.moduleRouter.set('core/*', Path.resolve( this.paths.juice, 'core'), moduleRewrite );

        if(this.paths.modules){
            for( let tag in this.paths.modules ){
                this.moduleRouter.set( tag+'/*', this.paths.modules[tag], moduleRewrite );
            }
        }

        if( this.config.require ){
            this.require( ...this.config.require ).then( ( ...required ) => {
                return this.emit('ready', ...required );
            });
        }

        setTimeout(() => {
            this.ready = true;
        }, 0 );

        return false;
    }

}


export { JuiceJS as default, JuiceModule, JuiceBlender, Global }; 