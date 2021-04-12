import Client from '../client/base.mjs';
console.log(Client.browser);
const sheets = {};

const head = document.head || document.getElementsByTagName('head')[0];

const btypes = ['-webkit-', '-moz-', '-o-', '-khtml-', '-ms-'];

const prefixed = ['animation', 'animation-name', 'animation-duration', 'animation-timing-function', 
'animation-iteration-count', 'animation-delay', 'transform', 'transform-origin', 'perspective', 
'transform', 'transition', 'transition-duration', 'transition-delay', 'transition-property', 'transition-timing-function',
'user-select', 'box-shadow'];

let activeSheet = null;
const browserPrefix = null;

class Style {

	type="class";
	properties = {};

	constructor( className, props ){
		this.properties = props;
		if(className.indexOf('@keyframes') != -1){
			this.type="keyframes";
		}

		if( browserPrefix ){

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
					if(Client.browser.prefix && Client.browser.prefix.css) props[Client.browser.prefix.css+k] = _props[prop];
				}else{
					props[k] = _props[prop];
				}
			}
		}
		return props;
	};

	toText(){
		var txt = "";
		for( let prop in this.properties){
			var k = prop.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
			txt += k;
			if(typeof this.properties[prop] == 'object'){
				txt += '{ '+this.toText(this.properties[prop])+' } ';
			}else{
				txt += ':'+this.properties[prop]+';';
			}
		}console.log( txt );
		
		return txt;
	};

}

class StyleSheetRule {

	rule = null;
	selector = null;
	sheet=null;
	properties = {};
	constructor( StyleRule, index ){
		this.index = index;
		this.selector = StyleRule.selectorText;
		this.sheet = StyleRule.parentStyleSheet;
		this.rule = StyleRule;
		if( StyleRule.style )
		for( let i=0;i<StyleRule.style.length;i++ ){
			const prop = StyleRule.style[i];
			this.properties[prop] = StyleRule.style[prop];
		}
	}

	add(){
		const style = new Style( this.selector, this.properties );
		let propText = style.toText();
		console.log(this.sheet);
		const sheet = new StyleSheet(this.sheet);
		if( this.index === undefined ) this.index = sheet.rules.length;
		const ruleTxt = this.selector + '{ '+ propText +' }';
		this.sheet.insertRule( ruleTxt, this.index );

		//sheet.append( this.selector + '{ '+ propText +' }' );
		const rule = sheet.rules.find( this.selector );
		return rule;
	}

	save(){
		if( this.index ){
			this.delete();
			this.add();
		}else{
			this.add();
		}
	}

	delete( ){
		if( !this.index ) return null;
		if(this.sheet.cssRules) { 
			this.sheet.deleteRule( this.index );
		}else{
			this.sheet.removeRule( this.index );
		}
	}

	set( prop, value ){
		this.properties[prop] = value;
	}

	apply( props ){
		for( let prop in props ){
			this.properties[prop] = props[prop];
		}
	}
}

class StyleSheetRules {

	sheet = null;

	constructor( stylesheet ){
		console.log('StyleSheetRules', stylesheet );
		this.sheet = stylesheet.sheet || stylesheet;
		this.list = this.sheet.rules || this.sheet.cssRules;
	}

	get length(){
		return this.list.length;
	}

	find( selector ){
		for(var i=0;i<this.list.length;i++)
		if( this.list[i].selectorText == selector ) {
		 const rule = new StyleSheetRule( this.list[i], i );
		 return rule;
		}
		return new StyleSheetRule( { parentStyleSheet: this.sheet, selectorText: selector } );
	}

	add( selector, props ){
		const rule = new StyleSheetRule( { parentStyleSheet: this.sheet, selectorText: selector } );
		rule.properties = props;
		rule.save( this.sheet );
		return rule;
	}

	addMany( list ){
		for( let selector in list ){
			this.add( selector, list[selector] );
		}
	}

	remove( selector ){
		var rule = this.find( selector );
		if(!rule) return null;
		rule.delete();
		return;
	};
}

class StyleSheet {

	dom = null;
	scope = null;
	id = null;
	rules = null;

	constructor( id, scope ){
		if( scope ) this.scope = scope;
		if( typeof id == 'string' ){
			this.id = id;
			this.dom = sheets[id] || StyleSheet.find( id ) || StyleSheet.create( id, scope );
		}else if( id && ( id.ownerNode || id.owningElement ) ){
			if(  id.ownerNode ){
				this.id = id.ownerNode.id;
				this.dom = id.ownerNode;
			}else{
				this.id = id.owningElement.id;
				this.dom = id.owningElement;
			}
		}
		this.rules = new StyleSheetRules( this.dom );
	}

	static create( id, scope ) {
		// Create the <style> tag
		var styleSheet = document.createElement("style");
		styleSheet.id = id;
		styleSheet.type = 'text/css';
		styleSheet.disabled = false;
		if(styleSheet.styleSheet){
			styleSheet.styleSheet.cssText = "";
		}else{
			styleSheet.appendChild(document.createTextNode(""));
		}
		( scope || document.getElementsByTagName('head')[0] ).appendChild( styleSheet );
		sheets[id] = styleSheet;
		return styleSheet;
	}

	static find( id ){

		let styleSheet;

		if(sheets[id]) return sheets[id];

		var ss = document.styleSheets;
		for(var i = 0; i < ss.length; ++i){
			if(ss[i].ownerNode && ss[i].ownerNode.id == id){
				styleSheet = ss[i];
				break;
			}else if (ss[i].owningElement && ss[i].owningElement.id == id) {
				styleSheet = ss[i];
				break;
			}
		}

		if( styleSheet ) sheets[id] = styleSheet;
		return styleSheet;

	};


	append( content ){
		const styleSheet = this.dom;
		console.log(styleSheet);
		content += " \n";
		if(styleSheet.styleSheet){
			styleSheet.styleSheet.cssText += content;
		}else{
			styleSheet.appendChild(document.createTextNode(content));
		}
	}

	clear(){
		const styleSheet = this.dom;
		if(styleSheet.styleSheet){
			styleSheet.styleSheet.cssText = "";
		}else{
			styleSheet.innerHTML = "";
			styleSheet.appendChild(document.createTextNode(""));
		}
	}


}

class CSS {
	
	static sheets = [];

	static get tags(){
		return document.styleSheets;
	}

	static StyleSheet( id, scope ){
		return new StyleSheet( id, scope );
	}

	static use( id='default' ){

		if(!sheets[id]){
			if(!StyleSheet.find( id )) 
				StyleSheet.create( id );
			return sheets[id];
		}

		return sheets[id];
	};

}

export default CSS;

/*

class CSS {


	//Create New Style Element
	
		


	exports.appendClass = function( _class, _props ){
		var sheet = this.sheet();
		var props = Style.prefix(_props);
		//console.log(global.browser.cssPrefix);
		if(_class.indexOf('@keyframes') != -1){
				var kprops = {};
				for(keyframe in props){
					kprops[keyframe] = Style.prefix(props[keyframe]);
				}
				if( Client.browser.prefix && Client.browser.prefix.css){
				this.addRule(_class.replace('@keyframes','@'+Client.browser.prefix.css+'keyframes'), kprops);
				}
				this.addRule(_class, kprops);
		}else{
			this.addRule(_class, props);
		}
		sheet.disabled = false;
	};
	
	
	exports.append = function(){
		//console.log(arguments);
		if(typeof arguments[0] == 'object'){
			for(var c in arguments[0]){
				this.appendClass(c, arguments[0][c]);
			}
		}else{
			this.appendClass(arguments[0], arguments[1]);
		}
		
	};
	
	
	exports.rule = function( selector, index ){
		var rules = this.rules();
		var rule = {};
		for(var i=0;i<rules.length;i++)
			if(rules[i].selectorText == selector) rule.id = i;
		if(!rule.id) return null;
		rule.style = rules[rule.id].style;
		return rule;
	};
	
	
	exports.ruleProps = function( selector ){
		var rule = this.rule(selector);
		var _curr = rule.style.cssText.split(';');
		var props = {};
		for(var p=0;p<_curr.length;p++){
			var pvals = _curr[p].split(':');
			if(pvals.length > 1){
				var k =pvals[0].replace(/^\s+|\s+$/g,'');
				var val = pvals[1].replace(/^\s+|\s+$/g,'');
				props[k] = val;
			}
		}
		return props;
	};
	
		
	
	
	exports.addRule = function( selector, props, index ){
		var sheet = this.sheet();
		var rules = this.rules();

		if(!index) index = this.rules().length;
		var propText = this.toText(props);
		if(sheet.styleSheet)
			sheet.styleSheet.cssText += selector + '{'+ propText +'}';
		else
			this.styleSheet.appendChild(document.createTextNode(selector + '{'+ propText +'}'));
			sheet.disabled = false;
		return this;
	};

	exports.updateRule = function( selector, props ){
		var rule = this.rule(selector);
		if(rule){
			var _curr = rule.style.cssText.split(';');
			for(var p=0;p<_curr.length;p++){
				var pvals = _curr[p].split(':');
				if(pvals.length > 1){
					var k =pvals[0].replace(/^\s+|\s+$/g,'');
					var val = pvals[1].replace(/^\s+|\s+$/g,'');
					if(!props[k]) props[k] = val;
				}
			}
			this.deleteRule(selector);
			//Merge !!!
			this.addRule(selector, props, rule.id);
		}else{
			console.warning('Cant Update Non-Existing Rule');
		}
		//rtxt += this.rules()[index].style.cssText;
	};
	
	
	exports.set = function( selector, props, replace ){
		var sheet = this.sheet();
		var rule = this.rule(selector);

		if(rule){
			if(replace){
				this.deleteRule( selector );
				this.appendClass( selector, props );
			}else{
				this.updateRule(selector, props);
			}
		}else{
			this.appendClass( selector, props );
		}
		sheet.disabled = false;

	};
	
	

	exports.deleteRule = function( selector ){
		var sheet = this.sheet();
		var rule = this.rule(selector);
		if(!rule) return null;
		if(sheet.cssRules) { 
			sheet.deleteRule( rule.id );
		}else{
			sheet.removeRule( rule.id );
		}
		sheet.disabled = false;
		return;
	};
	
	exports.clearX = function(){
		var sheet = this.sheet();
		var rules = this.rules();
		sheet.innerHTML = "";
		
	};

	exports.clear = function( selector, props, index ){
		var sheet = this.sheet();
		sheet.innerHTML = "";
	};
	
	
	
}

*/