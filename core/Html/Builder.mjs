import HTMLParser from './Parser.mjs';


const REGEX = {
    attrs: /\[(.*?)\]/,
    classes: /\.([a-zA-Z0-9\-\_]+)/g,
    id: /#([a-zA-Z0-9\-\_]+)/g,
    split_parts: /(?:[^\s"]+|"[^"]*")+/g,
    mapped_Id: /@([a-zA-Z0-9\-\_]+)/g
}

/*class HTMLElement {

}
*/
class HTMLBuilder {

    scope = null;

    constructor( domString, container ){
        
        this.scope = tmp;
        this.parts = domString.match( REGEX.split_parts );
        const tmp = this.parseParts();

        
        var nodes = tmp.childNodes.length > 1 ? tmp.childNodes : tmp.firstChild;
        
        if(Object.keys(mapped).length > 0){
            return { elements: nodes, map: mapped };
        }else{
            return nodes;
        }
    }

    parseSelector( selector ){

        const parsed = {};
        //If Selector starts with "
        if(selector.charAt(0) == '\"'){
            return { element: document.createTextNode(selector.replace(/"/g, '')) };
        }
        
        //If Mapped Id Present
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

    parseParts(){

        const mapped = {};
        const parts = [ ...this.parts ];

        let tmp = document.createElement('div');
        let root = tmp;

        while(parts.length > 0){

            var parsed = this.parseSelector( parts.shift() );
            const built = this.build( parsed );
            
            var item = built.element;
            if(built.mapped_id) mapped[built.mapped_id] = item;
    
            root.appendChild( item );
            switch(parts[0]){
                case '>':
                parts.shift();
                root = item;
                break;
                case '<':
                parts.shift();
                root = root.parentNode;
                break;
                case '<<':
                parts.shift();
                root = root.parentNode.parentNode;
                break;
                case '"':
                var str = [];
                str.push( parts.shift() );
                while(parts[0].charAt(parts[0].length) != '"'){
                    str.push( parts.shift() );
                }
                str.push( parts.shift() );
                parts[0] = str.join(' ');
                break;
            }
            
        }

        return tmp;
    }

    

    build( discriptor ){

        const { attrs, classes, content, id, selector } = discriptor;

        var tmp = document.createElement( selector );
		
		if( id ) tmp.id = id;

        if( attrs ){
            for( prop in attrs ){
                tmp.setAttribute( prop, attrs[prop] );
            }
        }

		if( classes ) tmp.className = classes.join(' ').replace('.','');
		
		if( content ) tmp.innerHTML = content;
		
		return { element: tmp, mapped_id: mapped_id };
    }


}