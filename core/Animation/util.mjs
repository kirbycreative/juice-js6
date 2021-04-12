class AnimationUtil {
    
    static pointDistance( points ){
        
        const deltas = [];
        deltas = [ ( point1.x - point2.x ), ( point1.y - point2.y ) ];
        if( point1.z !== undefined ) deltas.push( point1.z - point2.z ); 

        return Math.hypot( ...deltas );
    }

    static toSeconds(ms){
        return ms/1000;
    }

    static diff( a, b ){
        return a - b;
    }

    static delta( last, now ){
        return ( now - last ) / 1000;
    }

    static FPS( delta ){
        return 1/delta;
    }
}

export default AnimationUtil;