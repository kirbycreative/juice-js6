import AnimationStage from './Stage.mjs';
import AnimationView from './View.mjs';
import Timeline from './Timeline.mjs';
import Debug from './Debug.mjs';

new Debug();

class Animation {
    
    id = null;

    constructor( id, container ){
        this.id = id;
        this.view = new AnimationView( this, container );
        this.stage = new AnimationStage( this );
    }


}

export default Animation;