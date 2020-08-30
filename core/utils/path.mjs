import Client from './client.mjs'
const client = new Client();

class Path {

    static get sep(){
        if( client.os == 'win' ) return '\\';
        else return '/';
    }

    static dir( path ){
        return path.substring(0, path.lastIndexOf( this.sep ) + 1 );
    }

    static split( path ){
        return path.split('');
    }

    static filename( path ){
        return path.split('\\').pop().split('/').pop();
    }

    static resolve( ...parts ){
        return parts.join( this.sep );
    }

    static ext( path ){
        return path.substring( path.lastIndexOf(".")+1 );
    }

    static script( search ){
        var scripts = document.getElementsByTagName("script");
        let idx = scripts.length - 1;
        if( search ){
            for( let i=0;i<scripts.length;i++) 
                if(scripts[i].src.indexOf( search ) !== -1 ){
                    idx = i;
                    break;
                }
        }
        return scripts[ idx ].src;
    }

}

export { Path as default }