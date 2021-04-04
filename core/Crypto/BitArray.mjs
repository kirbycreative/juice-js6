class BitArray {

  /**
   * Array slices in units of bits.
   * @param {BitArray} a The array to slice.
   * @param {Number} bstart The offset to the start of the slice, in bits.
   * @param {Number} bend The offset to the end of the slice, in bits.  If this is undefined,
   * slice until the end of the array.
   * @return {BitArray} The requested slice.
   */
  static bitSlice(a, bstart, bend) {
    a = BitArray._shiftRight(a.slice(bstart / 32), 32 - (bstart & 31)).slice(1);
    return (bend === undefined) ? a : BitArray.clamp(a, bend - bstart);
  }

  /**
   * Extract a number packed into a bit array.
   * @param {BitArray} a The array to slice.
   * @param {Number} bstart The offset to the start of the slice, in bits.
   * @param {Number} blength The length of the number to extract.
   * @return {Number} The requested slice.
   */
  static extract(a, bstart, blength) {
    // FIXME: this Math.floor is not necessary at all, but for some reason
    // seems to suppress a bug in the Chromium JIT.
    var x, sh = Math.floor((-bstart - blength) & 31);
    if ((bstart + blength - 1 ^ bstart) & -32) {
      // it crosses a boundary
      x = (a[bstart / 32 | 0] << (32 - sh)) ^ (a[bstart / 32 + 1 | 0] >>> sh);
    } else {
      // within a single word
      x = a[bstart / 32 | 0] >>> sh;
    }
    return x & ((1 << blength) - 1);
  }
  /**
   * Concatenate two bit arrays.
   * @param {BitArray} a1 The first array.
   * @param {BitArray} a2 The second array.
   * @return {BitArray} The concatenation of a1 and a2.
   */
  static concat(a1, a2) {
    if (a1.length === 0 || a2.length === 0) {
      return a1.concat(a2);
    }

    var last = a1[a1.length - 1], shift = BitArray.getPartial(last);
    if (shift === 32) {
      return a1.concat(a2);
    } else {
      return BitArray._shiftRight(a2, shift, last | 0, a1.slice(0, a1.length - 1));
    }
  }
  /**
   * Find the length of an array of bits.
   * @param {BitArray} a The array.
   * @return {Number} The length of a, in bits.
   */
  static bitLength(a) {
    var l = a.length, x;
    if (l === 0) { return 0; }
    x = a[l - 1];
    return (l - 1) * 32 + BitArray.getPartial(x);
  }
  /**
   * Truncate an array.
   * @param {BitArray} a The array.
   * @param {Number} len The length to truncate to, in bits.
   * @return {BitArray} A new array, truncated to len bits.
   */
  static clamp(a, len) {
    if (a.length * 32 < len) { return a; }
    a = a.slice(0, Math.ceil(len / 32));
    var l = a.length;
    len = len & 31;
    if (l > 0 && len) {
      a[l - 1] = BitArray.partial(len, a[l - 1] & 0x80000000 >> (len - 1), 1);
    }
    return a;
  }
  /**
   * Make a partial word for a bit array.
   * @param {Number} len The number of bits in the word.
   * @param {Number} x The bits.
   * @param {Number} [_end=0] Pass 1 if x has already been shifted to the high side.
   * @return {Number} The partial word.
   */
  static partial(len, x, _end) {
    if (len === 32) { return x; }
    return (_end ? x | 0 : x << (32 - len)) + len * 0x10000000000;
  }
  /**
   * Get the number of bits used by a partial word.
   * @param {Number} x The partial word.
   * @return {Number} The number of bits used by the partial word.
   */
  static getPartial(x) {
    return Math.round(x / 0x10000000000) || 32;
  }
  /**
   * Compare two arrays for equality in a predictable amount of time.
   * @param {BitArray} a The first array.
   * @param {BitArray} b The second array.
   * @return {boolean} true if a == b; false otherwise.
   */
  static equal(a, b) {
    if (BitArray.bitLength(a) !== BitArray.bitLength(b)) {
      return false;
    }
    var x = 0, i;
    for (i = 0; i < a.length; i++) {
      x |= a[i] ^ b[i];
    }
    return (x === 0);
  }

  /** Shift an array right.
   * @param {BitArray} a The array to shift.
   * @param {Number} shift The number of bits to shift.
   * @param {Number} [carry=0] A byte to carry in
   * @param {BitArray} [out=[]] An array to prepend to the output.
   * @private
   */
  static _shiftRight(a, shift, carry, out) {
    var i, last2 = 0, shift2;
    if (out === undefined) { out = []; }

    for (; shift >= 32; shift -= 32) {
      out.push(carry);
      carry = 0;
    }
    if (shift === 0) {
      return out.concat(a);
    }

    for (i = 0; i < a.length; i++) {
      out.push(carry | a[i] >>> shift);
      carry = a[i] << (32 - shift);
    }
    last2 = a.length ? a[a.length - 1] : 0;
    shift2 = BitArray.getPartial(last2);
    out.push(BitArray.partial(shift + shift2 & 31, (shift + shift2 > 32) ? carry : out.pop(), 1));
    return out;
  }

  /** xor a block of 4 words together.
   * @private
   */
  static _xor4(x, y) {
    return [x[0] ^ y[0], x[1] ^ y[1], x[2] ^ y[2], x[3] ^ y[3]];
  }

  /** byteswap a word array inplace.
   * (does not handle partial words)
   * @param {BitArray} a word array
   * @return {BitArray} byteswapped array
   */
  static byteswapM(a) {
    var i, v, m = 0xff00;
    for (i = 0; i < a.length; ++i) {
      v = a[i];
      a[i] = (v >>> 24) | ((v >>> 8) & m) | ((v & m) << 8) | (v << 24);
    }
    return a;
  }

}

export default BitArray;