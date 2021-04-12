import CSS from '../style/css.mjs';

// Create a class for the element
class DebugInfo extends HTMLElement {
    fps = null;
    constructor() {
        // Always call super first in constructor
        super();
        // Create a shadow root
        var shadow = this.attachShadow({mode: 'open'});
        this.shadow = shadow;

        const stylesheet = CSS.StyleSheet('debug-style' );
        console.log(stylesheet);
        stylesheet.rules.addMany({
            '.wrapper': {
                backgroundColor: "#000",
                minHeight: "20px",
                color: "#FFF"
            }
        });

        const wrapper = document.createElement('div');
        wrapper.className = "wrapper";

        const fps = document.createElement('div');
        fps.className = "fps";
        this.fps = fps;

        const time = document.createElement('div');
        time.className = "time";

        shadow.appendChild( wrapper );
        wrapper.appendChild( fps );

    }

    connectedCallback() {
        console.log('createdCallback');
        this.fps.innerHTML = "<b>I'm an x-foo-with-markup!</b>";
    };

    attributeChangedCallback(attrName, oldVal, newVal){

    }

}

customElements.define('debug-info', DebugInfo );

class Debug {

    constructor(){
        this.build();
    }

    build(){
        console.log('Build Debug');
        const container = document.createElement('debug-info');
        document.body.appendChild( container );

        return container; 
    }

}

export default Debug;