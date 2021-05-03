import Custom from '../Dom/Custom.mjs';

class AnimationBody extends Custom.HTMLElement { 
  

    static get html(){
        return '<div class="position" ref="position" ><div class="rotation" ref="rotation" ><div class="anchor"></div><div class="offset" ref="offset" ><div class="content" ref="content"></div></div></div></div>';
    }

    static get style(){
        return {
            ':host': {
                position:'absolute',
                display: 'block'
            },
            ':host([debug]) .content': {
                border: '1px solid #d2d2d2'
            },
            ':host([anchor*="center"])': {
                top: '50%',
                left: '50%'
            },
            ':host([anchor*="left"])': {
                left: 0
            },
            ':host([anchor*="right"])': {
                left: '100%'
            },
            ':host([anchor*="top"])': {
                top: 0
            },
            ':host([anchor*="bottom"])': {
                top: '100%'
            },
            '.content': {
                position: 'relative',
                width: 'auto',
                height: 'auto'
            },
            '.offset': {
                position: 'absolute',
                transform: 'translate( -50%, -50% )'
            },
            '.anchor': {
                position: 'absolute',
                width: '10px',
                height: '10px',
                marginLeft: '-5px',
                marginTop: '-5px',
                borderRadius: '50%',
                border: '1px solid red',
                zIndex: 1000
            },
            '.anchor:after':{
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                display: 'block',
                width: '1px',
                height: '40px',
                background: 'red',
                transform: 'translate( -50%, -50% )'
            },
            '.anchor:before':{
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                display: 'block',
                width: '40px',
                height: '1px',
                background: 'red',
                transform: 'translate( -50%, -50% )'
            }
        };
    }

    static get observedAttributes() {
        return ['width', 'height', 'x', 'y', 'z', 'rotation', 'anchor', 'scale', 'debug'];
    }

    content = null;
    constructor(){
        super();

        
    
        this.content = this.root.querySelector('.content');
        console.log('CREATE ANIMATION BODY');
    }

    append( el ){
        console.dir(this);
        this.content.appendChild( el );
    }

    onConnect(){
        this.scale = 1;
    }

    onAttributeChanged( attrName, oldVal, newVal ){
        //console.log( attrName, oldVal, newVal, this.anchor );
        if(!this.defer) this.render();
    }

    render(){
        let transform = `translate3d(${this.x}px, ${this.y}px, 0)`;

        this.refs.position.style.transform = transform;


        if( this.changed.indexOf('rotation') !== -1 )
        this.refs.rotation.style.transform = `rotate(${this.rotation}deg)`;

        
        this.changed = [];
    }

}

customElements.define('animation-body', AnimationBody );

export default AnimationBody;