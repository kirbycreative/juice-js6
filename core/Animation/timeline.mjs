window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(f){return setTimeout(f, 1000/60)} // simulate calling code 60 
 
window.cancelAnimationFrame = window.cancelAnimationFrame
    || window.mozCancelAnimationFrame
    || function(requestID){clearTimeout(requestID)} //fall back


import AniUtil from './Util.mjs';


class AnimationTime {

    start = null;
	last = 0;
	ms = 0;
	delta = 0;
	frame = 0;

    constructor(){

    }

    update( _ms ){
        if(!this.start) this.start = _ms;

        this.last = this.ms;
        this.ms = _ms - this.start;

		this.frame++; 
		this.delta = AniUtil.toSeconds( this.ms - this.last );
        this.fps = AniUtil.FPS( this.delta );
    }

    static toSeconds( ms ){
        return ms/1000;
    }
}


class Ticker {

    active = false;
    timelines = [];
    ms = 0;

    time = new AnimationTime();

    constructor( ...timelines ){
        this.timelines = timelines;
    }


    start(){
        const self = this;
        self.active = true;

        function tick( ms ){
            self.ms = ms;
            //console.log('Ticker tick', ms, self.timelines );
            for(let i=0;i<self.timelines.length;i++){
                if( self.timelines[i].fps ){
                    
                } 
                self.timelines[i].tick( ms );
                if( !self.timelines[i].active ){
                    self.timelines.splice(i, 1); 
                    i--; 
                }
            }

            if( self.timelines.length == 0 ) self.stop( tick );

            if( self.active )
            window.requestAnimationFrame( tick ); 
            return false;
        }

        window.requestAnimationFrame( tick );

    }

    stop( fn ){
        this.active = false;
        if( fn ) window.cancelAnimationFrame( fn );
    }

    add( ...timelines ){
        for(let i=0;i<timelines.length;i++) 
            this.timelines.push( timelines[i] );
        if( !this.active ) this.start();
    }

}

const ticker = new Ticker();

class Timeline {

    start = 0;
    ms = null;
    active = true;
    fps = null;

    update = null;
    render = null;

    time = null;

    constructor(){
        console.log('new Timeline');
        this.time = new AnimationTime();
        ticker.add( this );
    }

    tick( ms ){
        this.time.update( ms );
       // console.log( 'tick', this.time );
        if( this.fps ){

        }

        if( this.update ) this.update();

    }
}


export default Timeline;