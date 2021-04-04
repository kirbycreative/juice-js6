class Definable {

    defined={};

    define( prop, value, options ){
        const self = this;
        if( self[prop] !== undefined ) self.defined[prop] = self[prop];
        delete self[prop];
        Object.defineProperty( self, prop, {
            get: function(){
                return self.defined[prop];
            },
            set: function( value ){
                if(options.before) options.before( prop, value );
                self.defined[prop] = value;
                if(options.after) options.after( prop, value );
                return value;
            }
        });

        return;
    }
}

export { Definable as default }