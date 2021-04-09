import ObjectUtil from '../Utils/Object.mjs';
/*

OPTIONS = {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  }

  mode: "no-cors" only allows a limited set of headers in the request: 
    Accept
    Accept-Language
    Content-Language
    Content-Type: with a value of application/x-www-form-urlencoded, multipart/form-data, or text/plain

*/

const CONTENT_TYPES = {
    'text': 'text/plain',
    'json': 'application/json',
    'form': 'application/x-www-form-urlencoded',
    'files': 'multipart/form-data',
    'xml': 'application/xml'
}

const OPTIONS = {
    method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
    mode: [ 'cors', 'no-cors', 'same-origin'],
    cache: [ 'default', 'no-cache', 'reload', 'force-cache', 'only-if-cached'],
    credentials: ['same-origin', 'include', 'omit'],
    headers: {
      'Content-Type': ['application/json', 'application/x-www-form-urlencoded','multipart/form-data','text/plain'],
    },
    redirect: ['follow', 'manual', 'error'], 
    referrerPolicy: ['no-referrer-when-downgrade', 'no-referrer', 'origin', 'origin-when-cross-origin', 'same-origin', 'strict-origin', 'strict-origin-when-cross-origin', 'unsafe-url'], 
    body: ''
}

const CORS_SAFE_HEADERS = {
    'Accept': null, 
    'Accept-Language': null, 
    'Content-Language': null, 
    'Content-Type': ['application/x-www-form-urlencoded','multipart/form-data','text/plain']
};

class FetchHeaders extends Headers{
    
    constructor( props ){
        if( typeof props == 'string' ){
            props = { 'Content-Type': props };
        }
        super( props );
    }

    set( prop, value ){
        this.append( prop, value );
    }

    setCustom( prop, value ){
        this.append('X-'+prop, value );
    }
}

class FetchOptions {

    type = null;
    method = null;
    options = {};
   

    constructor( options={} ){
        this.options = options;
        this.headers = new FetchHeaders(); 
    }

    compile(){
        //Set default Method
        if( !this.options.method ) this.options.method = 'GET';

        //Compile Request Data
        if(this.data){
            if( ['GET', 'DELETE'].indexOf( this.options.method ) !== -1  ){
                this.query = Object.keys( this.data ).map( key => key+'='+this.data[key] ).join('&'); 
            }else{
                switch( this.type ){
                    case 'json':
                        this.options.body = JSON.stringify( this.data )
                    break;
                    case 'form':
                        this.options.body = new FormData();
                        for( let prop in this.data ){
                            this.options.body.append( prop, this.data[prop] );
                        }
                    break;
                    default:
                        this.options.body = this.data;
                }
            }
        }
        return this.options;
    }


    body( data, type ){
        if( type ) this.type = type;
        this.data = data;
        this.setTimeout();
        return this;
    }

    option( prop, value ){
        this.options[prop] = value;
        this.setTimeout();
        return this;
    }

    options( options ){
        ObjectUtil.merge( options, this.options, true );
        this.setTimeout();
        return this;
    }

    get( data ){
        this.options.method = 'GET';
        if( data ) this.body( data );
        this.setTimeout();
        return this;
    }

    delete( data ){
        this.options.method = 'DELETE';
        if( data ) this.body( data );
        this.setTimeout();
        return this;
    }

    head( data ){
        this.options.method = 'HEAD';
        if( data ) this.body( data );
        this.setTimeout();
        return this;
    }

    post( data, type ){
        this.options.method = 'POST';
        if( data ) this.body( data, type );
        this.setTimeout();
        return this;
    }

    put( data, type ){
        this.options.method = 'PUT';
        if( data ) this.body( data, type );
        this.setTimeout();
        return this;
    }

    setTimeout(){
        clearTimeout( this.TO );
        this.TO = setTimeout( () => { this.compile() }, 1 );
    }

}

class Fetch {

    static get( url, data, options ){
        const opts = new FetchOptions( options ).get( data );
        return fetch( url, opts.options );
    }

    static delete( url, data, options ){
        const opts = new FetchOptions( options ).delete( data );
        return fetch( url, opts.options );
    }

    static head( url, data, options ){
        const opts = new FetchOptions( options ).head( data );
        return fetch( url, opts.options );
    }

    static post( url, data, options ){
        const opts = new FetchOptions( options ).post( data );
        return fetch( url, opts.options );
    }

    static put( url, data, options ){
        const opts = new FetchOptions( options ).put( data );
        return fetch( url, opts.options );
    }

}

export default Fetch;