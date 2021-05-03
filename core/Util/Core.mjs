function inspect( item ){
    const desc = {};
    desc.type = rawType( item );
    desc.name = item.constructor && item.constructor.name || item.name;
    console.log('INSPECTED', item, desc );
    return desc;
}

function rawType( sym, is_type ){
    var t = Object.prototype.toString.call(sym).split(' ').pop().replace(']', '');
    return is_type ? is_type === t : t;
}

function type( sym, is_type ){
    var t = Object.prototype.toString.call(sym).split(' ').pop().replace(']', '').toLowerCase();
    return is_type ? is_type === t : t;
}


class Util {
    static type = type;
    static rawType = rawType;
    static inspect = inspect;
}

export default Util;

