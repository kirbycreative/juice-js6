const head = document.getElementsByTagName('head')[0];

class StyleSheet {

    constructor( id, scope ){

    }

}


class StyleSheets {

    constructor( id, scope ){
        console.log( 'StyleSheets' );

        document.addEventListener('DOMContentLoaded', () => {
            this.init();
        });
    }

    init(){
        console.log( 'init' );
        var ss = document.styleSheets;
        for(var i = 0; i < ss.length; ++i){
            const owner = ( ss[i].ownerNode || ss[i].owningElement );
            let id = owner.id || owner.title;
            if( !owner.id ){

            }
            console.log( owner );
            
        }
    }
    
}

export default new StyleSheets();