import AnimationStage from './Stage.mjs';
import AnimationView from './View.mjs';
import Timeline from './Timeline.mjs';
import Debug from './Debug.mjs';


class Animation {
    
    id = null;
    elements = [];

    constructor( id, container ){
        const self = this;
        this.id = id;
        this.view = new AnimationView( this, container );
        this.stage = new AnimationStage( this );
        this.timeline = new Timeline();

        this.timeline.update = function(){
            for(let i=0;i<self.elements.length;i++){
                if(self.elements[i].update) self.elements[i].update( self.timeline.time );
            }
            if( self.debugger ){
                self.debugger.fps = Math.floor( self.timeline.time.fps );
                self.debugger.time = ( self.timeline.time.ms/1000 ).toFixed(3);
            }
        }

        this.timeline.render = function(){
            for(let i=0;i<self.elements.length;i++){
                if(self.elements[i].render) self.elements[i].render( self.timeline.time );
            }
        }
    }

    add( element ){
        this.elements.push( element );
    }

    remove( element ){
        for(let i=0;i<this.elements.length;i++){
            if(this.elements[i] === element ) this.elements.splice(i, 1);
        }
    }

    debug(){
        this.debugger = new Debug();
    }


}

export default Animation;