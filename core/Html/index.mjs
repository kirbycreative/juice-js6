import Parser from './parser.mjs';
import Templates from './tpls.mjs';

class HTML {
    
    static get Parser(){
        return Parser;
    }

    static get Templates(){
        return Templates;
    }

}

export { HTTML as default }