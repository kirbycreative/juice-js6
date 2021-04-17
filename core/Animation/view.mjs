class AnimationView {

    container = null;
    width=null;
    height=null;

    constructor( animation, container ){
        this.container = container;
        const rect = container.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        console.log( 'AnimationView', animation );
    }


}


export default AnimationView;