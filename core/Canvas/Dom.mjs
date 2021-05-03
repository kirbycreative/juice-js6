import Custom from '../Dom/Custom.mjs';
import { last, move, sortByProp } from '../Util/Array.mjs';
import Util from '../Util/Core.mjs';

console.log(Custom.CanvasElement);

class JuiceCanvas extends Custom.CanvasElement {

    static config = { shadow: false };
   
    constructor( width=0, height=0 ){
        super();
        this.width = width;
        this.height = height;
    }

    get context(){
        return this.getContext('2d');
    }

    clear( x, y, w, h ){
        return this.context.clearRect( x || 0, y || 0, w || this.width, h || this.height );
    }

    copy( x, y, w, h ){
        return this.context.getImageData( x || 0, y || 0, w, h );
    }

    drawImage( img, { x: sx=0, y: sy=0, width: sw, height: sh }, { x: dx=0, y: dy=0, width: dw=0, height: dh=0, scale } ){

        sw = sw || img.width;
        sh = sh || img.height;

        if( !scale && ( !dh || !dw ) && ( dh || dw ) ){
            if( dw ) scale = dw/sw;
            if( dh ) scale = dh/sh;
        }

        if( !scale && !dh && !dw ){
            scale = 1;
        }

        if( scale ){
            dw = sw * scale;
            dh = sh * scale;
        }

        //console.log( img, sx, sy, sw, sh, dx, dy, dw, dh );

        //If needed resize canvas to accomidate drawn img
        if( ( dx + dw ) > this.width || ( dy + dh ) > this.height ){
            //console.log( 'BEFORE RESIZE', dx+dw, dy+dh );
            this.resize( dx+dw, dy+dh );
        }
        return this.context.drawImage( img, sx, sy, sw, sh, dx, dy, dw, dh );
    }

    resize( w, h ){
        //console.log( 'RESIZE', w, h );
        if( this.width > 0 && this.height > 0 ){
            const tmp = this.copy( 0, 0, this.width, this.height );
            this.width = w;
            this.height = h;
            this.clear( 0, 0, this.width, this.height );
            this.paste( tmp, 0, 0 );
        }else{
            this.width = w;
            this.height = h;
        }
        
    }

    paste( imageData, x, y ){
        return this.context.putImageData( imageData, x || 0, y || 0 );
    }

    shift( px ){

        if( isNaN(this.width) || isNaN( this.height ) || this.width == 0 || px == 0 || isNaN(px) ) return;
        var abs = Math.abs( px );
        const dir = px < 0 ? 'left' : 'right';
        var copy = { x: 0, y: 0 , w: this.width - abs, h: this.height };
        var paste = { x: 0, y: 0 };

        if( dir == 'left' ){
            copy.x = abs;
        }else{
            paste.x = px;
        }

        var imageData = this.context.getImageData( copy.x, copy.y, copy.w, copy.h );
        //Clear All Data
        this.context.clearRect( ( dir == 'left' ? this.width-abs : 0 ), 0, abs, this.height );
        //Paste Saved Data
        this.context.putImageData( imageData, paste.x, paste.y );

        return false;
    };

}

console.dir(JuiceCanvas);

class CanvasLayers extends Custom.HTMLElement {

    static get observedAttributes(){
        return ['width', 'height'];
    }

    static get style(){
        return {
            ':host': {
                position:'relative',
                width:'100%',
                height:'100%',
                display: 'block'
            },
            'juice-canvas': {
                position: 'absolute',
                top: 0,
                left: 0
            }
        };
    }

    layers = [];
    layerKeys = {};

    constructor(){

    }

    updateIndex( layer, newIndex ){
        if( layer && newIndex ){
            move( this.layers, layer.index, newIndex );
        }
        for( let i=0;i<this.layers.length;i++ ){
            this.layers[i].index = i;
            this.layers[i].layer.style.zIndex = i;
        }
    }

    createLayer( key, index ){

        const canvas = document.createElement('juice-canvas');
        canvas.width = this.width;
        canvas.height = this.height;

        const layerIndex = index || last( this.layers ).index + 1;
        const layerData = { layer: canvas, index: layerIndex };
    
        this.layers.splice( layerIndex, 0, layerData );
        this.updateIndex();
    
        this.root.appendChild( layerData.canvas );
        this.layerKeys[key] = layerData;

    }

    layer( key, index ){
        if( !this.layerKeys[key] ) this.createLayer( key );
        if( index ) this.updateIndex( this.layerKeys[key], index );
        return this.layerKeys[key];
    }

    onAttributeChanged( attr, oldVal, newVal ){
        switch(attr){
            case 'width':
                for(let i=0;i<this.layers.length;i++) this.layers[i].layer.width = newVal;
            break;
            case 'height':
                for(let i=0;i<this.layers.length;i++) this.layers[i].layer.height = newVal;
            break;
        }
    }

}

customElements.define('canvas-layers', CanvasLayers );
customElements.define('juice-canvas', JuiceCanvas, { extends: 'canvas' } );

export default JuiceCanvas;