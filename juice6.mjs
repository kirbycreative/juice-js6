import Path from './core/Utils/Path.mjs'
import EventEmitter from './core/event/Emitter.mjs';
import ObjectUtil from './core/Utils/Object.mjs';

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




class JuiceJS extends EventEmitter {

    config = {};
    paths = { 
        juice: script.dir, 
        root: script.url.origin,
        modules: {
            core: Path.resolve( script.dir, 'core' ) 
        }
    };

    global = window || global;
    
    static Module = JuiceModule;
    static Blender = JuiceBlender;

    constructor( config=null ){

        super( 'ready' );

        if(config) ObjectUtil.merge( config, this.config, true );

        if( this.global.JUICE_CONFIG ){
            ObjectUtil.merge( this.global.JUICE_CONFIG, this.config, true );
            if( this.config.paths ){
                ObjectUtil.merge( this.config.paths, this.paths, true );
            }
        }

        this.initialize();

    }

    expose( variable, ns ){
        this.global[ns] = variable;
    }

    async moduleAsync( mpath, dir ){
        return this.module( mpath, dir );
    }

    module( mpath, dir ){

        const parts = [ ( dir || this.dir ), 'core', mpath ];
        return new Promise((resolve, reject) => {
            if( Path.ext( mpath ) === undefined ) parts.push('.mjs');
            const fullpath = Path.resolve( ...parts );

            import( fullpath ).then( ( Module ) => {
                resolve( Module.default );
            }).catch( reject );
           
            return false;
        });

    }

    parsePath( path, dir=null ){
        const paths = [];
        if( dir ){
            const directory = this.paths[dir] || this.paths.modules[dir] || dir;

        }

        if( path.charAt(0) == '/' ){
            dir = this.paths.root;
        }else if( path.substring( 0, 2 ) == './' ){
            dir = this.paths.juice;
        }else if( path.indexOf(/^((http|https):\/\/)/) === 0 ){
            
        }else if( path.indexOf('/') !== -1 ){
            const parts = path.split('/');
        }

    }

    initialize(){
        this.ready = true;
    }

}

//const juice = new JuiceJS();
//juice.expose( juice, 'juice' );

export { JuiceJS as default, JuiceModule, JuiceBlender }; 