class DomElement {

    defined = {};
    dom = null;
    id = null;
    tag = 'div';
    parent = null;

    constructor({ tag, id, parent, width, height, ...options }){
        if( tag ) this.tag = tag;
        if( id ) this.id = id;
        if( width ) this.width = width;
        if( height ) this.height = height;
        if( parent ) this.parent = ( typeof parent == 'string' ? document.querySelector( parent ) : parent );
        this.options = options || {};
        this.build();
    }

    set height( h ){
        if( h == undefined ) h=0;
        this.defined.height = h; 
        if( this.dom ){
            if( ['canvas'].indexOf( this.tag ) !== -1 ) this.dom.height = h;
            else this.dom.style.height = h+'px';
        }
    }

    get height(){
        return this.defined.height;
    }

    set width( w ){
        if( w == undefined ) w=0;
        this.defined.width = w; 
        if( this.dom ){
            if( ['canvas'].indexOf( this.tag ) !== -1 ) this.dom.width = w;
            else this.dom.style.width = w+'px';
        }
    }

    get width(){
        return this.defined.width;
    }

    get zIndex(){
        return this.defined.zIndex;
    }

    set zIndex( zIndex ){
        this.defined.zIndex = zIndex;
        if( !this.dom.style.position ) this.dom.style.position = 'relative';
        if( this.dom ) this.dom.zIndex = zIndex;
    }

    fit(){
        const rect = ( this.parent || this.dom.parentNode ).getBoundingClientRect();
        this.resize( rect.width, rect.height );
    }

    resize( w=0, h=0 ){
        this.width = w || this.defined.width;
        this.height = h || this.defined.height;
    }

    append( child ){
        this.dom.appendChild( child );
    }

    prepend( child ){
        this.dom.insertBefore( child, this.dom.firstChild );
    }

    get style(){
        return this.dom.style;
    }

    build(){
        this.dom = document.createElement( this.tag );
        if( this.id ) this.dom.id = this.id;
        this.resize();
        if( this.options.zIndex ) this.zIndex = this.options.zIndex;
        if( this.parent ) this.parent.appendChild( this.dom );
    }
}

export default DomElement;