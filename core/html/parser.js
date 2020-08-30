class HTMLParser {

    constructor( html ){
        this.input = html;
    }

    head(){
       return this.input.toString().split(/<head([^>]*)>/).pop().split(/<\/head>/).shift().trim();
    }

    body(){
        return this.input.toString().split(/<body([^>]*)>/).pop().split(/<\/body>/).shift().trim();
    }
}

export { HTMLParser as default }