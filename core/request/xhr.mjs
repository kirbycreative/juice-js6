function createRequest(){
				
    var isIE8 = window.XDomainRequest ? true : false;
    if (window.XMLHttpRequest){
        return isIE8 ? new window.XDomainRequest() : new XMLHttpRequest();
    }else{
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
    
}

class Request {

    options={};

    constructor( url ){

        const self = this;
        self.url = url;
        self.options = options;
      
    }

    data( data, dataType='formdata' ){
        if(!this.reqData) this.reqData = new FormData();
        for(var prop in data){
            this.reqData.append( prop, data[prop] );
        }
        return this;
    }

    headers( headers ){
        if(!this.reqHeaders) this.reqHeaders = [];
        for( var name in headers ){
            this.reqHeaders.push([name, headers[name]])
        }
        return this;
    }

    send( method ){


        const xhr = createRequest();

        xhr.open( method, this.url, true );
    
        if( this.reqHeaders ){
            xhr.setRequestHeader.apply( xhr, this.reqHeaders );
        }
        new Promise(( resolve, reject ) => {
            xhr.onreadystatechange = function(){
                var state = xhr.readyState;
                var responseType =  xhr.responseType || 'text';
                var resp =  responseType == 'text' ? xhr.responseText : xhr.response;

                if(state == 4){

                    if( xhr.status >= 400 ) {
                        //Catch Error

                        return false;
                    }

                    //Successful Req

                }
            }
            xhr.send( self.data );
        });


    }

    processData( data ){
        this.data = new FormData();
        for(var prop in data){
            this.data.append( prop, data[prop] );
        }

    }
}

function XHRRequest( type, path, params ){
    if(!params) params = {};
    var req, callback, fcallback, pcallback, _data;
    console.log(type, path, params);
    
    if(params.data){

        if( params.sendType ){
            switch( params.sendType ){
                case 'json':
                _data = JSON.stringify(params.data);
                break;
            }
        }else{
        
            _data = new FormData();
            for(var prop in params.data){
                if(params.cakephp && typeof params.data[prop] == 'object'){
                    for(var subprop in params.data[prop]){
                        if(params.cakephp){
                            _data.append('data['+prop+']['+subprop+']', params.data[prop][subprop] );
                        }else{
                            _data.append(prop, typeof params.data[prop] == 'object' ? JSON.stringify(params.data[prop]) : params.data[prop] );
                        }
                    }
                }else{
                    _data.append(prop, params.data[prop] );
                }
                
            }
        }
    }
             
    req = {
        url: path,
        xhr: new createRequest(),
        progress: function( pfn ){
            req.xhr.onprogress = pfn;
            return req;
        },
        success: function( cb ){
            callback = cb;
            return req;
        },
        fail: function( fcb ){
            fcallback = fcb;
            return req;
        }
    };
      
    

   // exports.requests.push(req);
    
    req.xhr.onreadystatechange = function(){
        var state = req.xhr.readyState;
        var responseType =  req.xhr.responseType || 'text';
        var resp =  responseType == 'text' ? req.xhr.responseText : req.xhr.response;
        
        console.log( state, req.xhr.status );

        if(state == 4){
            
            if (req.xhr.status >= 400) {
                if(typeof fcallback == 'function'){

                    if(responseType == 'text')
                    switch( params.dataType.toLowerCase() ){
                        case 'json':
                            resp = req.xhr.responseType ? req.xhr.response : JSON.parse(req.xhr.responseText);
                        break;
                    }

                    fcallback( resp || req.xhr.responseText, req.xhr.status);
                    return false;
                }
                return false;
            }

            if(typeof callback == 'function'){
                //console.log(req.xhr);
                if(resp == ""){
                    console.log( req.url + ' Responce Empty');
                    callback(null , req.xhr );
                    return false;
                }

                if( params.dataType && responseType == 'text')
                switch(params.dataType.toLowerCase()){
                    case 'json':
                        resp = req.xhr.responseType ? req.xhr.response : JSON.parse(req.xhr.responseText);
                    break;
                }

                callback( resp, req.xhr.status, req.xhr );
                return false;
                
            }
        
        }
        return false;
    };

    req.xhr.responseType  = params.dataType || 'json';


    req.xhr.open( type, path, true );
    
    if( params.headers ){
        for(var name in params.headers){
            req.xhr.setRequestHeader( name, params.headers[name] );
        }
    }

    req.xhr.send( _data );
    
    return req;
}

class XHR {

    static post( path, params ){
        return new XHRRequest( 'POST', path, params );
    }

    static get( path, params ){
        var xhr = new XHRRequest( 'GET', path, params );
        return xhr;
    }

    static head( path, params ){
        var xhr = new XHRRequest( 'HEAD', path, params );
        return xhr;
    }

    static put( path, params ){
        return new XHRRequest( 'POST', path, params );
    }

    static async posAsync( path, params ){
        return new Promise((resolve, reject) => {
            new XHRRequest( 'POST', path, params ).success( resolve ).fail( reject );
        });
    }

    static async getAsync( path, params ){
        return new Promise((resolve, reject) => {
            new XHRRequest( 'GET', path, params ).success( resolve ).fail( reject );
        });
    }

    static async headAsync( path, params ){
        return new Promise((resolve, reject) => {
            new XHRRequest( 'HEAD', path, params ).success( resolve ).fail( reject );
        });
    }

    static async putAsync( path, params ){
        return new Promise((resolve, reject) => {
            new XHRRequest( 'POST', path, params ).success( resolve ).fail( reject );
        });
    }
}

export default XHR;