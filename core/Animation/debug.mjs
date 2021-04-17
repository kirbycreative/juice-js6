import Styles from '../Style/Styles.mjs';
import Dom from '../Dom/Core.mjs';

const template = document.createElement('template');

const styles = new Styles({
    '.wrapper': {
        position: 'absolute',
        bottom: 0,
        backgroundColor: "rgba(0,0,0, 0.6)",
        minHeight: "20px",
        color: "#FFF",
        fontFamily: 'Arial, Helvetica, Sans-Serif'
    },
    'h3': {
        padding: '5px 10px',
        margin: 0,
        fontSize: '1.6em',
        borderBottom: '1px solid #FFF'
    },
    'dl': {
        padding: '10px 0',
        margin: 0
    },
    'dl > div': {
        clear: 'both',
        padding: '2.5px 10px'
    },
    'dl > div:after': {
        content: '""',
        display: 'block',
        clear: 'both'
    },
    'dt': {
        float: 'left',
        textTransform: 'uppercase',
        width: '60px'
    },
    'dt:after': {
        content: '":"'
    },
    'dd': {
        float: 'left',
        marginLeft: '20px',
        width: '60px'
    },
    'dd:after': {
        content: '""',
        clear: 'both',
        display: 'block'
    },
    
});

template.innerHTML = styles.asText( true );

// Create a class for the element
class DebugInfo extends HTMLElement {
   
    ref = {};

    static get observedAttributes() {
        return ['fps', 'time'];
    }

    constructor() {
        // Always call super first in constructor
        super();
        // Create a shadow root
        var shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild( template.content.cloneNode(true) );
        this.shadow = shadow;

        const contents = Dom.build({
            class: "wrapper",
            children: [
                {
                tag: 'h3', 
                text: "Debugger"
                },
                Dom.dl({
                    fps: 0,
                    time: 0,
                    rotation: 0,
                    speed: 0,
                    position: "0,0,0"
                })
        ]
        });

        
        this.ref = contents.refs;

        shadow.appendChild( contents.element );
        

        for( let ref in this.ref ){
            this.setObservable( ref, this.ref[ref].innerText );
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

  
    connectedCallback() {
        
    };

    disconnectedCallback(){

    }

    attributeChangedCallback( attrName, oldVal, newVal ){
        //console.log( attrName, oldVal, newVal );
        switch( attrName ){
            case 'unknown':
               
            break;
            default:
                if( this.ref[attrName] ) this.ref[attrName].innerText = newVal;
        }
    }

}

customElements.define('debug-info', DebugInfo );

class Debug {

    constructor(){
        return this.build();
    }

    build(){
        console.log('Build Debug');
        const container = document.createElement('debug-info');
        document.body.appendChild( container );

        container.setAttribute('fps', 30);

        container.fps = 60;
        return container; 
    }

}

export default Debug;