class REGEX {

    

    static attributes = /([^\r\n\t\f\v= '"]+)(?:=(["'])?((?:.(?!\2?\s+(?:\S+)=|\2))+.)\2?)?/g;


    static tag( tag ){
        return new RegExp(`/<${tag}([^>]*)>/`);
    }

    static close( tag ){
        return new RegExp(`/<\/${tag}>/`);
    }

    static open( tag ){
        return new RegExp(`/<${tag}(*)>/`);
    }
}

class HTMLElementParser {

    constructor( html ){
        this.input = html;
    }

}


class HTMLParser {

    REGEX = REGEX;
    rootTags = "head,body".split(',');
    body = null;
    head = null;

    constructor( html ){
        this.input = html;
    }

    static extractTags( ...tagNames ){
        const tags = {};
        while( tagNames.length > 0 ){
            const tag = tagNames.shift();
            tags[tag] = this.input.toString().split( REGEX.tag( tag ) ).pop().split( REGEX.close( tag ) ).shift().trim();
        }
        return tags;
    }

    static head(){
       return this.input.toString().split( REGEX.tag('head') ).pop().split( REGEX.close('head') ).shift().trim();
    }

    static body(){
        return this.input.toString().split( REGEX.tag('body') ).pop().split( REGEX.close('body') ).shift().trim();
    }
}

export { HTMLParser as default }