import DomElement from '../Dom/Element.mjs';
import CustomDom from '../Dom/Custom.mjs';
import Canvas from '../Canvas/Core.mjs';

import Util from '../Util/Core.mjs';

import AnimationBody from './Body.mjs';

import SpriteSheet from './SpriteSheet.mjs';
import Custom from '../Dom/Custom.mjs';

class AnimationAnchorPoint extends Custom.HTMLElement { 
    
    static get html(){
        return '<div class="x-y"></div>';
    }

    static get style(){
        return {
            ':host': {
                position:'absolute',
                left:'50%',
                top:'50%',
                display: 'block'
            },
            '.x-y': {
                height: '40px',
                width: '40px',
                borderLeft: '2px solid green',
                borderBottom: '2px solid red',
                transform: 'translate(0, -100%)'
            },
            ':host:before': {
                content: "attr(x)",
                height: '10px',
                width: '40px',
                position: 'absolute',
                top: '4px',
                fontFamily: 'Arial, Helvetica',
                fontWeight: 'bold'
            },
            ':host:after': {
                content: "attr(y)",
                height: '10px',
                width: '40px',
                position: 'absolute',
                left: '-30px',
                top: 0,
                fontFamily: 'Arial, Helvetica',
                fontWeight: 'bold',
                transform: 'rotate(90deg)',
                transformOrgin: 'left bottom'
            }
        };
    }

    static get observedAttributes() {
        return ['x', 'y'];
    }

    constructor(){
        super();
      
    }

    onConnect(){

    }

}


class AnimationStageBackground extends  Custom.HTMLElement { 
    static get html(){
        return null;
    }

    static get style(){
        return null;
    }

    static get observedAttributes() {
        return ['layer'];
    }

    constructor(){
        super();
      
    }

    onConnect(){

    }

}

class AnimationStageLayer extends Custom.HTMLElement {

    stage = null;

    static get observedAttributes() {
        return ['name', 'index'];
    }
    constructor(){
        super();
        
    }

    onConnect(){
        
    }

    addBody( id ){
        const body = document.createElement('animation-body');
        body.id = 'animation-body-'+id;
        this.root.appendChild( body );
        return body;
    }

}


class AnimationStage extends Custom.HTMLElement {

    camera = {};
    layers = {};

    static get html(){
        return '<div class="stage"></div>';
    }

    static get style(){
        return {
            ':host': {
                position:'relative',
                width:'100%',
                height:'100%',
                display: 'block'
            },
           'stage-layer, stage-background': {
               display: 'block',
               position: 'absolute',
               width: '100%',
               height: '100%',
               left: 0,
               top: 0
           },
           'stage-background': {
               zIndex: 0
           }
        };
    }

    static get observedAttributes() {
        return [];
    }

    constructor( ){
        super();
        
        const staticLayers = this.querySelectorAll('stage-layer');
        console.log('Animation Stage constructor', this, staticLayers );
        for(let i=0;i<staticLayers.length;i++){
            this.layers[staticLayers[i].name] = staticLayers[i];
            staticLayers[i].stage = this;
        }

        
    }

    createLayer( name, options ){
        console.log('CREATE LAYER', name, this.layers );
        if(this.layers[name]){
            throw 'Layer with name already exists!';
        }
        const layerDom = document.createElement('stage-layer');
        layerDom.name = name;
        layerDom.stage = this;  
        this.layers[name] = layerDom;
        this.root.appendChild( layerDom );
        return layerDom;
    } 

    layer( name ){
        return this.layers[name];
    }

    onConnect(){
       console.log('Animation Stage CONNECTED', this);
       // const background = document.createElement('stage-background');
        //this.root.appendChild(background);
        const rect = this.getBoundingClientRect();
       
        console.log(rect);
        this.camera.width = rect.width;
        this.camera.height = rect.height;
    }

    onDisconnect(){

    }

    onAdopted(){

    }

    onAttributeChanged( attrName, oldVal, newVal ){

    }

}

customElements.define('stage-layer', AnimationStageLayer );

customElements.define('animation-stage', AnimationStage );

customElements.define('stage-background', AnimationStageBackground );


customElements.define('anchor-point', AnimationAnchorPoint );




export default AnimationStage;


