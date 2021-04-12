import AnimationStage from './stage.mjs';
import AnimationView from './view.mjs';
import Timeline from './timeline.mjs';
import Debug from './debug.mjs';

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