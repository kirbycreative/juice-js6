import AnimationStage from './Stage.mjs';
import AnimationView from './View.mjs';
import Timeline from './Timeline.mjs';
import Debug from './Debug.mjs';


class Animation {
    
    id = null;

    constructor( id, container ){
        const self = this;
        this.id = id;
        this.view = new AnimationView( this, container );
        this.stage = new AnimationStage( this );
        this.timeline = new Timeline();

        this.timeline.update = function(){
            if( self.debugger ){
                self.debugger.fps = Math.floor( self.timeline.time.fps );
                self.debugger.time = ( self.timeline.time.ms/1000 ).toFixed(3);
            }
        }
    }

    debug(){
        this.debugger = new Debug();
    }


}

export default Animation;