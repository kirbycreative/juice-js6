import client from './client.mjs';




class Path {

    static parse( src ){
        const type = Path.type( src );
        return {
            dir: Path.dir( src ),
            ext: Path.ext( src ),
            filename: Path.filename( src ),
            url: new URL( src ),
            type: type,
            src: src
        }
    }

    static get sep(){
        if( client.os == 'win' ) return '\\';
        else return '/';
    }

    static ext( path ){
        const idx = path.lastIndexOf(".");
        if( idx < path.length - 4 ) return;
        return path.substring( path.lastIndexOf(".")+1 );
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
        let ext = '';
        if( parts[parts.length-1].charAt(0) === '.' ) ext = parts.pop();
        return parts.map( part => part.replace(/^\/+|\/+$/g, '') ).join( this.sep ) +ext;
    }

    static type( src ){
        if( src.indexOf('http') === 0 ){
            return 'url';
        }else{
            return 'path'
        }
    }

    static script( search ){
        var scripts = document.getElementsByTagName("script");
        
        let idx = scripts.length - 1;
        if( search ){
            for( let i=0;i<scripts.length;i++){
                console.log(scripts[i].src);
                if(scripts[i].src.indexOf( search ) !== -1 ){
                    idx = i;
                    break;
                }
            }
        }
        return scripts[ idx ].src;
    }

}

export { Path as default }