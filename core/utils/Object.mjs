

class ObjectUtil {

    static merge( source, dest, overwrite=false ){
        for( let prop in source ){
            switch( typeof dest[prop] ){
                case 'object':
                    ObjectUtil.merge( source[prop], dest[prop], overwrite );
                break;
                case 'array':
                    for( let i=0;i<source[prop].length;i++){
                        if( dest[prop].indexOf(source[prop][i]) === -1 ) 
                        dest[prop].push( source[prop][i] );
                    }
                break;
                default:
                    dest[prop] = source[prop];
            }
        }
    }

}   

export default ObjectUtil;