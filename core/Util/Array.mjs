function first( arr ){
    return arr[0];
}

function last( arr ){
    return arr[arr.length-1];
}

function sortByProp( arr, key, options={} ){
    const dir = options.dir && options.dir.toUpperCase() == 'DESC' ? -1 : 1;
    if( !options.format ) options.format = function(v){ return v; }
    arr.sort(( a, b ) => {
        const av = options.format(a[key]), bv = options.format(b[key]);
        return ( av < bv ? -1 : ( av > bv ? 1 : 0 ) ) * dir;
    });
}

function move( arr, from, to ){
    arr.splice(to, 0, arr.splice(from, 1)[0]);
}

class ArrayUtil {
    static first = first;
    static last = last;
    static sortByProp = sortByProp;
    static move = move;
}

export { ArrayUtil as default, first, last, sortByProp, move }