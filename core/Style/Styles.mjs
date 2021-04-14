import browser from '../Client/Browser.mjs';
console.log(browser.prefix);
class Style {

	type="class";
	properties = {};

	constructor( className, props ){
        this.className = className;
		this.properties = props;
		if(className.indexOf('@keyframes') != -1){
			this.type="keyframes";
		}

		
	}

	static prefix( _props ){
		var props = {};
		for(prop in _props){
			if(typeof _props[prop] == 'object'){
				props[prop] = Style.prefix(_props[prop]);
			}else{
				var k = prop.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
				if(prefixed.indexOf(k) != -1){
					props[k] = _props[prop];
					if(browser.prefix && browser.prefix.css) props[browser.prefix.css+k] = _props[prop];
				}else{
					props[k] = _props[prop];
				}
			}
		}
		return props;
	};

    text(){
        return `${this.className}`+ "{ \n"
        + this.propertyText() 
        + "} \n\n"
    }

	propertyText(){
		var txt = ``;
		for( let prop in this.properties){
			var k = prop.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
			txt += "\t"+k;
			if(typeof this.properties[prop] == 'object'){
				txt += '{ '+this.toText(this.properties[prop])+' } ';
			}else{
				txt += ':'+this.properties[prop]+';'+"\n";
			}
		}
		
		return txt;
	};

}

class Styles extends Array{

    classes = []

    constructor( styles ){
        super();
        this.addMany( styles );
    }

    add( className, properties ){
        const style = new Style( className, properties );
        this.push( style );
        this.classes.push( className );
    }

    addMany( styles ){

        for( let className in styles ){
            this.add( className, styles[className] );
        }

    }

    asText( includeTag = false ){
        let txt = includeTag ? "<style> \n" : "";
        for( let i=0; i<this.length; i++ ){
            txt += this[i].text();
        }
        txt += includeTag ? "</style>" : "";
        return txt;
    }
}


export { Styles as default, Style }