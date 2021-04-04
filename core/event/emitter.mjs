import Definable from "../data/Definable.mjs";

class EmitterEvent extends Array {

    /**
     * @param  {String} name
     * @param  {Emitter Object} emitter
     */

    constructor( name, emitter ){
        super();
        this.name = name;
        Object.defineProperty( this, 'emitter', {
            get: () => emitter,
            set: () => false
        });
    }

    
    /**
     * @param  {Function} fn
     * @param  {Object} options={}
     */

    add( fn, options={} ){
        this.push({ fn: fn, options: options });
    }
    /**
     * @param  {Function} fn
     */
    remove( fn ){
        for( var i=0;i<this.length;i++ ){
            if( this[i].fn === fn ){
                this.splice( i, 1 );
                return true;
            }
        }
        return false;
    }
    
    /**
     * @param  {Mixed} ...args
     */
    emit( ...args ){
        for( var i=0;i<this.length;i++ ){
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

    /**
     * @param  {Emitter Object} emitter
     */

    constructor( emitter ){
        Object.defineProperty( this, 'emitter', {
            get: () => emitter,
            set: () => false
        });
    }

    /**
     * @param  {String} event
     */
    
    has( event ){
        return this.instances[event] ? true : false;
    }

    /**
     * @param  {String} event
     */

    get( event ){
        return this.instances[event];
    }

    /**
     * @param  {String} event
     * @param  {Function} fn
     * @param  {Object} options={}
     */

    add( event, fn, options={} ){

        if( !this.has( event ) )
            this.instances[event] = new EmitterEvent( event, this.emitter );

        this.instances[event].add( fn, options );

    }
    /**
     * @param  {String} event
     * @param  {Function} fn
     * @return { Boolean }
     */

    remove( event, fn ){
        if( !fn ) delete this.instances[event];
        this.instances[event].remove( fn );
        return true;
    }
}

class EventEmitter extends Definable {

    event = {
        accessable: []
    };

    /**
     * @param {...string} ...accessableEvents
     */

    constructor( ...accessableEvents ){
        super();
        const self = this;
        this.event.listeners = new EventListeners( this );
        
        if( accessableEvents.length > 0 ){
            for( let i=0;i<accessableEvents.length;i++){
                this.initAccessableEvents( accessableEvents[i] );
            }
        }

    }

    /**
     * @param  {String} accessableEvent
     */

    initAccessableEvents( accessableEvent ){
        const self = this;

        this.event.accessable.push( accessableEvent );

        self.define( accessableEvent, self[accessableEvent], {
            after: () => {
                self.emit( accessableEvent, self[accessableEvent] );
            }
        });

        if( self[accessableEvent] )
        setTimeout(() => { self.emit( accessableEvent, self[accessableEvent] ); }, 1 );
        
        return false;
    }

    /**
     * @param  { Emitter Object } inst
     */

    static bind( inst ){
        const emitter = new EventEmitter();
        inst.on = emitter.on;
        inst.once = emitter.once;
        inst.emit = emitter.emit;
    }

    /**
     * @param  {String} event
     * @param  {Function} fn
     * @param  {Object} options
     */

    on( event, fn, options ){
        this.event.listeners.add( event, fn, options );
    }

    /**
     * @param  {String} event
     * @param  {Function} fn
     */

    once( event, fn ){
        this.event.listeners.add( event, fn, { once: true } );
    }

    /**
     * @param  {String} event
     * @param  {Mixed Multi} ...args
     */

    emit( event, ...args ){
        if( this.event.listeners.has( event ) )
        this.event.listeners.get( event ).emit( ...args );
    }

}

export { EventEmitter as default }