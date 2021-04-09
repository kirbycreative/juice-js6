import EventEmitter from '../Event/Emitter.mjs';
import RequestInterceptor from '../Request/Interceptor.mjs';

class Routes {

    key = {}
    list = {};

    constructor(){

    }

    find( url ){
        const parts = url.split('/');
        let scope = this.key;
        const paths = [];
        while( parts.length > 0 && scope[parts[0]] ){
            const part = parts.shift();
            scope = scope[part];
            paths.push(part);
        }
        let rewrite;
        if( scope['*'] ){
            rewrite = url.replace( paths.join('/'), scope['*'].rewrite ) ;
            if(scope['*'].transform)
            rewrite = scope['*'].transform( rewrite );
        }
        return rewrite || url;
    }

    set( src, dest ){
        
        this.list[src] = dest;
        const parts = src.split('/');
        let scope = this.key;
        while( parts.length > 0 ){
            const part = parts.shift();
            if( !scope[part] ){
                scope[part] = parts.length > 0 ? {} : dest;
            }
            scope = scope[part];
        }
        
    }

}

class Router {

    routes = null;

    constructor(){
        this.routes = new Routes();
        this.initialize();
    }

    set( src, dest, transform ){
        if( typeof dest == 'string' ) dest = { rewrite: dest };
        if( transform ) dest.transform = transform;

        this.routes.set( src, dest );
    }

    route( url ){
        return this.routes.find( url );
    }

    initialize(){
        const self = this;
        //this.middle = new RequestInterceptor();
    }

}

export default Router;