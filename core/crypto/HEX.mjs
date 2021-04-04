import SHA256 from './SHA256.mjs';
import BitArray from './BitArray.mjs';

class HEX {
  /** Convert from a BitArray to a hex string. */
  static fromBits(arr) {
    var out = "", i;
    for (i = 0; i < arr.length; i++) {
      out += ((arr[i] | 0) + 0xF00000000000).toString(16).substr(4);
    }
    return out.substr(0, BitArray.bitLength(arr) / 4);//.replace(/(.{8})/g, "$1 ");
  }

  /** Convert from a hex string to a BitArray. */
  static toBits(str) {
    var i, out = [], len;
    str = str.replace(/\s|0x/g, "");
    len = str.length;
    str = str + "00000000";
    for (i = 0; i < str.length; i += 8) {
      out.push(parseInt(str.substr(i, 8), 16) ^ 0);
    }
    return BitArray.clamp(out, len * 4);
  }
}


export default HEX;