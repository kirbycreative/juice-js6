class CustomElement extends HTMLElement {

    defined = {};
    observable = [];

    static get observedAttributes() {
        return this.observable;
    }

    constructor( params ){
        super();
        
        this.observable = [ ...params.observable ];
        for( let i=0;i<this.observable.length;i++){
            this.setObservable( this.observable[i] );
        }

    }

    setObservable( property, value = "" ){
        Object.defineProperty( this, property, {
            get: () => {
                return this.defined[property];
            },
            set: ( value ) => {
                this.setAttribute( property, value );
            }
        });
    }

    connectedCallback(){
        if( this.onConnect ) return this.onConnect();
    }

    disconnectedCallback(){
        if( this.onDisconnect ) return this.onDisconnect();
    }

    adoptedCallback(){
        if( this.onAdopted ) return this.onAdopted();
    }

    attributeChangedCallback( ...args ){
        if( this.onAttributeChanged ) return this.onAttributeChanged( ...args );
    }


}


class Customelements {

}