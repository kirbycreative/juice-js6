import Definable from "../data/definable.mjs";

class EmitterEvent extends Array {

    constructor( name, emitter ){
        super();
        this.name = name;
        this.emitter = emitter;
    }

    add( fn, options={} ){
        this.push({ fn: fn, options: options });
    }

    remove( fn ){
        for( var i=0;i<this.length;i++ ){
            if( this[i].fn === fn ){
                this.splice( i, 1 );
                return true;
            }
        }
        return false;
    }

    emit( ...args ){
        for( var i=0;i<this.length;i++ ){
            console.log( this.name, this[i]);
            this[i].fn.apply( this.emitter, args );

            if(this[i].options.once){
                this.splice( i, 1 );
                i--;
            }
        }
    }
}

class EventListeners {

    instances = {};

    constructor( emitter ){
        this.emitter = emitter;
    }

    has( event ){
        return this.instances[event] ? true : false;
    }

    get( event ){
        return this.instances[event];
    }

    add( event, fn, options={} ){

        if( !this.has( event ) )
            this.instances[event] = new EmitterEvent( event );

        this.instances[event].add( fn, options );

    }

    remove( event, fn ){
        if( !fn ) delete this.instances[event];
        this.instances[event].remove( fn );
    }
}

class EventEmitter extends Definable {

    constructor( ...accessableEvents ){
        super();
        const self = this;
        this.listeners = new EventListeners( this );
        
        if( accessableEvents.length > 0 ){
            for( let i=0;i<accessableEvents.length;i++){
                this.initAccessableEvents( accessableEvents[i] );
            }
        }

    }

    initAccessableEvents( accessableEvent ){
        const self = this;
        
        self.define( accessableEvent, self[accessableEvent], {
            after: () => {
                self.emit( accessableEvent, self[accessableEvent] );
            }
        });

        if( self[accessableEvent] )
        setTimeout(() => { self.emit( accessableEvent, self[accessableEvent] ); }, 1 );
        
        return false;
    }

    static bind( inst ){
        const emitter = new EventEmitter();
        inst.on = emitter.on;
        inst.once = emitter.once;
        inst.emit = emitter.emit;
    }

    on( event, fn, options ){
        this.listeners.add( event, fn, options );
    }

    once( event, fn ){
        this.listeners.add( event, fn, { once: true } );
    }

    emit( event, ...args ){
        if( this.listeners.has( event ) )
        this.listeners.get( event ).emit( ...args );
    }

}

export { EventEmitter as default }