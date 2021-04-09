class RequestData {

    data = {};
    
    constructor( data ){
        this.data = data;
    }

    query(){
        return Object.keys( this.data ).map( key => key+'='+this.data[key] ).join('&');
    }

    json(){
        return JSON.stringify( this.data );
    }

    form(){
        const data = new FormData();
        for( let prop in this.data ){
            data.append( prop, this.data[prop] );
        }
        return data;
    }

    
}

export default RequestData;