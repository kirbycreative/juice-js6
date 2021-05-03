import Window from '../Client/Window.mjs';
import DomElement from '../Dom/Element.mjs';
import CanvasDom from './Dom.mjs';

class Canvas extends DomElement {

    constructor( options ){
        options.tag = 'juice-canvas';
        super( options );
        this.initialize();
    }

    get context(){
        return this.dom.getContext('2d');
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
            super.resize( w, h );
            this.clear( 0, 0, this.width, this.height );
            this.paste( tmp, 0, 0 );
        }else{
            super.resize( 1, 1 );
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

    initialize(){


        Window.on('resize', () => {

        });

    }
}

export default Canvas;