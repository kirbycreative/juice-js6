class Numeric {

    static padd( value, length ){
        while( (value+"").length < length ){
            value = "0"+value;
        }
        return value;
    }

}


export default Numeric;