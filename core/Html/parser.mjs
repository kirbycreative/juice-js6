class HTMLParser {

    constructor( html ){
        this.input = html;
    }

    static head(){
       return this.input.toString().split(/<head([^>]*)>/).pop().split(/<\/head>/).shift().trim();
    }

    static body(){
        return this.input.toString().split(/<body([^>]*)>/).pop().split(/<\/body>/).shift().trim();
    }
}

export { HTMLParser as default }