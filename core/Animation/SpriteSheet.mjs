import Custom from '../Dom/Custom.mjs';
import Canvas from '../Canvas/Core.mjs';
import Loader from '../Http/Loader.mjs';
import Util from '../Util/Core.mjs';

class SpriteSheet extends Custom.HTMLElement { 
    
    static get html(){
        return '<div class="view"><div class="sheet"></div></div>';
    }

    static get style(){
        return {
            ':host': {
                position: 'relative',
                display: 'block'
            },
            '.view': {
                overflow: 'hidden',
                position: 'relative'
            },
            '.sheet': {
                position: 'absolute',
                top: 0,
                left: 0
            },
            '.sheet canvas': {
                position: 'absolute',
                top: 0,
                left: 0
            }
        };
    }

    static get observedAttributes() {
        return ['width', 'height', 'frame'];
    }
    
    
    canvas = null;
    sources = [];
    frames = { current: 0, count: 0 };
    view = null;
    sheet = null;
    loop = true;
    constructor(){
        super();
        this.view = this.root.querySelector('.view');
        this.sheet = this.root.querySelector('.sheet');
        this.scale = 1;
        console.log('SPRITE_SHEET', this.view );
    }

    build(){
        for( let i=0;i<this.sources.length;i++ ){
            this.addSprite( this.sources[i] );
        }
        this.ready = true;
    }

    addSprite( img ){
       

        if(( this.width || this.height ) && ( !this.width || !this.height )){
            if( this.width ){

            }
        }

        if(!this.width) this.width = img.width * this.scale;
        if(!this.height) this.height = img.height * this.scale;

        const cw = this.canvas.width;

        const dest = { 
            x: cw, 
            y: 0
        }

        if(this.scale) dest.scale = this.scale;
        //console.dir(this.canvas);
        this.canvas.drawImage( img, { x: 0, y: 0 }, dest );
        if(img.parentNode) img.parentNode.removeChild( img );

        this.frames.count++;
    }

    next(){
        if( this.frames.current == this.frames.count-1 ){
            if(this.loop) 
            this.frames.current = 0;
            else return false;
        }
        this.frames.current++;
        return this.frames.current;
    }

    prev(){
        if( this.frames.current == 1 ){
            if(this.loop) 
            this.frames.current = this.frames.count+1;
            else return false;
        }
        this.frames.current--;
        return this.frames.current;
    }

    load( urls ){
        return new Promise( (resolve, reject) => {
            Loader.loadAll( ...urls ).then(( imgs ) => {
                this.sources = imgs;
                this.build();
                this.sheet.style.transform = `translate3d( -${ this.width * this.frames.current }px, 0, 0 )`;
                resolve();
            }).catch(reject);
        });
    }

    onConnect(){
        console.log('SpriteSheet CONNECT', this.view );
        const sources = this.root.querySelectorAll('img');
        if(sources.length)
        this.sources = Array.prototype.slice( sources );

        this.canvas = document.createElement('canvas', { is: "juice-canvas" });
        this.sheet.appendChild( this.canvas );
        /*
        this.canvas = new Canvas({
            id: 'spritesheet-canvas',
            parent: this.sheet
        });*/

        this.build();
    }

    onAttributeChanged( attrName, oldVal, newVal ){
        switch( attrName ){
            case 'width':
                this.frames.width = newVal;
            break;
            case 'height':
                this.frames.height = newVal;
            break;
            case 'frame':
                this.frames.current = newVal;
            break;
        }
        this.render();
    }

    render(){
        if( this.ready ){
            this.view.style.width = this.frames.width+'px';
            this.view.style.height = this.frames.height+'px';
            this.sheet.style.transform = `translate3d( -${ this.width * this.frames.current }px, 0, 0 )`;
        }
    }

}

customElements.define( 'sprite-sheet', SpriteSheet );

export default SpriteSheet;

