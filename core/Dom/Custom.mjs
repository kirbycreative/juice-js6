import Styles from '../Style/Styles.mjs';
import Dom from '../Dom/Core.mjs';
import Util from '../Util/Core.mjs';
import ObjectUtil from '../Util/Object.mjs';

const DEFAULT_CONFIG = {
    shadow: true,
    closed: false
};

const Custom = {};
const Defined = {};

function ComponentCompiler( name, BaseHTMLElement ){

    //console.log('ComponentCompiler', name, BaseHTMLElement.name, BaseHTMLElement );
    
    return { [name]: class extends BaseHTMLElement {

            static template = null;
        
            static initialized = false;

            static config = {};
        
            static initialize(){
        
                if( this.html || this.style ){
                    this.template = document.createElement('template');
                    if( this.style ){
                        this.template.innerHTML = new Styles( this.style ).asText( true );
                    }
                    if( this.html ){
                        this.template.innerHTML += this.html;
                    }
                }
        
                ObjectUtil.merge( DEFAULT_CONFIG, this.config );
        
                delete this.initialize;
            }
        
            static get html(){
                return null;
            }
        
            static get style(){
                return null;
            }
        
            static get observedAttributes() {
                return [];
            }
        
            static get observedProperties() {
                return [];
            }
        
            static get config() {
                return this._config;
            }
        
            refs = {};
            changed = [];
        
            constructor(){
        
                super();
        
                if( this.constructor.initialize ){
                    this.constructor.initialize();
                }
        
                const config = this.constructor.config;
               
                if( this.attachShadow && config.shadow ){
                    try{
                        //Attached Shadow Dom
                        this.root = this.attachShadow({ mode: config.closed ? 'closed' : 'open' });
                    }catch(e){
                        //Shadow Dom Not Supported
                        this.root = this;
                    }
                }else{
                    this.root = this;
                }
        
                
                if( this.constructor.template )
                this.root.appendChild( this.constructor.template.content.cloneNode(true) );

                const refs = this.root.querySelectorAll('[ref]');
                for(let i=0;i<refs.length;i++){
                    this.refs[refs[i].getAttribute('ref')] = refs[i];
                }
            
                if(this.constructor.observedProperties.length){
                    for(let i=0;i<this.constructor.observedProperties.length;i++){
                        const prop = this.constructor.observedProperties[i];
                    }
                }
        
            }

            connectedCallback(){

                

                if( this.onConnect ) this.onConnect();
                this.dispatchEvent(new Event('connect'));
                setTimeout(() => { 
                    if( this.onReady ) this.onReady();
                    this.dispatchEvent(new Event('ready'));
                });
            }

            disconnectedCallback(){
                this.dispatchEvent(new Event('disconnect'));
                if( this.onDisconnect ) return this.onDisconnect();
            }

            adoptedCallback(){
                this.dispatchEvent(new Event('adopted'));
                if( this.onAdopted ) return this.onAdopted();
            }

            attributeChangedCallback( attr, oldVal, newVal ){
                if( this.onAttributeChanged ) this.onAttributeChanged( attr, oldVal, newVal );
            }
        
        
        }

        //END Custom Class

    }[name];

}

Custom.Compiler = ComponentCompiler;

function createComponent( name, Extends ){
    Object.defineProperty( Custom, name, {
        get: () => { 
            if( Defined[name] ) return Defined[name];
            else Defined[name] = ComponentCompiler( name, Extends )
            return Defined[name];
        
        },
        set: () => false
    })
}

createComponent( 'HTMLElement', HTMLElement );
createComponent( 'CanvasElement', HTMLCanvasElement );





           /*
            #setObservable( property, value = "" ){
                Object.defineProperty( this, property, {
                    get: () => {
                        return this.defined[property];
                    },
                    set: ( value ) => {
                        if( this.changed.indexOf(property) == -1 ) this.changed.push(property);
                        //console.log( this.constructor.name, property, value );
                        if( OBSERVABLE_OPTIONS[property] ){

                        }
                        this.defined[property] = value;
                        this.setAttribute( property, value );
                        return true;
                    }
                });
            }

            connectedCallback(){
                if( this.onConnect ) this.onConnect();
                this.dispatchEvent(new Event('connect'));
                setTimeout(() => { 
                    if( this.onReady ) this.onReady();
                    this.dispatchEvent(new Event('ready'));
                });
            }

            disconnectedCallback(){
                this.dispatchEvent(new Event('disconnect'));
                if( this.onDisconnect ) return this.onDisconnect();
            }

            adoptedCallback(){
                this.dispatchEvent(new Event('adopted'));
                if( this.onAdopted ) return this.onAdopted();
            }

            attributeChangedCallback( attr, oldVal, newVal ){
                  
                if( oldVal == newVal ) return;
                

                if( OBSERVABLE_OPTIONS[attr] ){
                    if( OBSERVABLE_OPTIONS[attr].type ){
                        switch(OBSERVABLE_OPTIONS[attr].type){
                            case 'number':
                                newVal = Number(newVal);
                            break;
                        }
                    }
                }

                if( this[attr] !== newVal ) this.defined[attr] = newVal;

                if( OBSERVABLE_OPTIONS[attr] && OBSERVABLE_OPTIONS[attr].after){
                    OBSERVABLE_OPTIONS[attr].after( newVal );
                }

                if( this.onAttributeChanged ) this.onAttributeChanged( attr, oldVal, newVal );

                if( !this.defer && this.render ) this.render();
            }


        }

       
    
        */

export default Custom;