class REGEX {

    static attrs = /\[(.*?)\]/g;
    static classes = /\.([a-zA-Z0-9\-\_]+)/g;
    static id = /#([a-zA-Z0-9\-\_]+)/g;
    static split_parts = /(?:[^\s"]+|"[^"]*")+/g;
    static mapped_Id = /@([a-zA-Z0-9\-\_]+)/g;


};

class Selector {

    constructor( selector ){

    }

    static find( selector ){
        return document.querySelector( selector );
    }

    static findAll( selector ){
        return document.querySelectorAll( selector );
    }

    parse(){
        const parsed = {};
        //If Selector starts with "
        if(selector.charAt(0) == '\"'){
            return { element: document.createTextNode( selector.replace(/"/g, '') ) };
        }
        
        //If has Mapped Id
        if(selector.indexOf('@') != -1){
            parsed.mapped_id = selector.match( REGEX.mapped_id )[0].replace('@', '');
            selector = selector.replace( '@'+parsed.mapped_id, '');
        }
        
        //If has ID Attribute
        if(selector.indexOf('#') != -1){
            parsed.id = selector.match( REGEX.id )[0].replace('#', '');
            selector = selector.replace('#'+parsed.id, '');
        }
        
        //If has Attributes
        if(selector.indexOf('[') != -1){
            parsed.attrs = selector.match( REGEX.attrs );
        }
        
        //If Has Classes
        if(selector.indexOf('.') != -1){
            parsed.classes = selector.match( REGEX.classes );
            for(var i=0;i<parsed.classes.length;i++){
                selector = selector.replace(classes[i], '');
            }
        }

        //If Has Content String
        if(selector.indexOf('"') != -1){
            parsed.content = selector.match(/"(.*?)"/)[1];
            selector = selector.replace(/"(.*?)"/g, '');
        }

        parsed.selector = selector;

        return parsed;
    }

}

export default Selector;