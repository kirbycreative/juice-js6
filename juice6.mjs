import Path from './core/Utils/Path.mjs';
import EventEmitter from './core/event/Emitter.mjs';
import ObjectUtil from './core/Utils/Object.mjs';
import Router from './core/App/Router.mjs';
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
    paths = { 
        juice: script.dir, 
        root: script.url.origin,
        modules: {
            core: '/core'
        }
    };

    global = window || global;

    router = null;
    
    static Module = JuiceModule;
    static Blender = JuiceBlender;

    constructor( config=null ){

        super( 'ready' );

        if( config ) ObjectUtil.merge( config, this.config, true );
        if( this.global.JUICE_CONFIG ) ObjectUtil.merge( this.global.JUICE_CONFIG, this.config, true );
        if( this.config.paths ) ObjectUtil.merge( this.config.paths, this.paths, true );
        
        console.log(this.paths);

        this.moduleRouter = new Router();

    

        this.initialize();

    }

    expose( variable, ns ){
        this.global[ns] = variable;
    }

    require( ...modules ){
        return Promise.all( modules.map( module => this.module( module ) ) );
    }

    async moduleAsync( mpath, dir ){
        return this.module( mpath, dir );
    }

    module( mpath, dir = 'core' ){

        const fullpath = this.moduleRouter.route( Path.resolve( dir, mpath ) );
        console.log( mpath, fullpath );

        return new Promise((resolve, reject) => {
            
            import( fullpath ).then( ( Module ) => {
                resolve( Module.default );
            }).catch( reject );
           
            return false;
        });

    }



    initialize(){

        const moduleRewrite = ( rewrite ) => {
            return rewrite + '.mjs';
        }

        this.moduleRouter.set('core/*', '/core', moduleRewrite );

        if(this.paths.modules){
            for( let tag in this.paths.modules ){
                this.moduleRouter.set( tag+'/*', this.paths.modules[tag], moduleRewrite );
            }
        }

        setTimeout(() => {
            this.ready = true;
        }, 0 );

        return false;
    }

}

//const juice = new JuiceJS();
//juice.expose( juice, 'juice' );

export { JuiceJS as default, JuiceModule, JuiceBlender }; 