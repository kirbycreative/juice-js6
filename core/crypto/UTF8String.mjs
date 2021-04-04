
import BitArray from 'BitArray.mjs';

class UTF8String {

  static fromBits(arr) {
    var out = "", bl = BitArray.bitLength(arr), i, tmp;
    for (i = 0; i < bl / 8; i++) {
      if ((i & 3) === 0) {
        tmp = arr[i / 4];
      }
      out += String.fromCharCode(tmp >>> 24);
      tmp <<= 8;
    }
    return decodeURIComponent(escape(out));
  }

  /** Convert from a UTF-8 string to a BitArray. */
  static toBits(str) {
    str = unescape(encodeURIComponent(str));
    var out = [], i, tmp = 0;
    for (i = 0; i < str.length; i++) {
      tmp = tmp << 8 | str.charCodeAt(i);
      if ((i & 3) === 3) {
        out.push(tmp);
        tmp = 0;
      }
    }
    if (i & 3) {
      out.push(BitArray.partial(8 * (i & 3), tmp));
    }
    return out;
  }

}


export default UTF8String;