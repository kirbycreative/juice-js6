import UTF8String from './UTF8String.mjs';
import BitArray from './BitArray.mjs';

class SHA256 {

  static blockSize = 512;
  _init = [];
  _key = [];

  constructor(hash) {
    if (!this._key[0]) { this._precompute(); }
    if (hash) {
      this._h = hash._h.slice(0);
      this._buffer = hash._buffer.slice(0);
      this._length = hash._length;
    } else {
      this.reset();
    }
  }

  reset() {
    this._h = this._init.slice(0);
    this._buffer = [];
    this._length = 0;
    return this;
  }

  /**
   * Input several words to the hash.
   * @param {BitArray|String} data the data to hash.
   * @return this
   */
  update(data) {
    if (typeof data === "string") {
      data = UTF8String.toBits(data);
    }
    var i, b = this._buffer = BitArray.concat(this._buffer, data),
      ol = this._length,
      nl = this._length = ol + BitArray.bitLength(data);
    if (nl > 9007199254740991) {
      throw new Error("Cannot hash more than 2^53 - 1 bits");
    }
    if (typeof Uint32Array !== 'undefined') {
      var c = new Uint32Array(b);
      var j = 0;
      for (i = 512 + ol - ((512 + ol) & 511); i <= nl; i += 512) {
        this._block(c.subarray(16 * j, 16 * (j + 1)));
        j += 1;
      }
      b.splice(0, 16 * j);
    } else {
      for (i = 512 + ol - ((512 + ol) & 511); i <= nl; i += 512) {
        this._block(b.splice(0, 16));
      }
    }
    return this;
  }

  /**
   * Complete hashing and output the hash value.
   * @return {BitArray} The hash value, an array of 8 big-endian words.
   */
  finalize() {
    var i, b = this._buffer, h = this._h;
    // Round out and push the buffer
    b = BitArray.concat(b, [BitArray.partial(1, 1)]);

    // Round out the buffer to a multiple of 16 words, less the 2 length words.
    for (i = b.length + 2; i & 15; i++) {
      b.push(0);
    }

    // append the length
    b.push(Math.floor(this._length / 0x100000000));
    b.push(this._length | 0);
    while (b.length) {
      this._block(b.splice(0, 16));
    }
    this.reset();
    return h;
  }
  /**
   * The SHA-256 initialization vector, to be precomputed.
   * @private
   */

  /*
  _key:
    [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
     0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
     0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
     0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
     0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
     0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
     0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
     0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2],
  */
  /**
   * Function to precompute _init and _key.
   * @private
   */
  _precompute() {
    var i = 0, prime = 2, factor, isPrime;
    function frac(x) { return (x - Math.floor(x)) * 0x100000000 | 0; }
    for (; i < 64; prime++) {
      isPrime = true;
      for (factor = 2; factor * factor <= prime; factor++) {
        if (prime % factor === 0) {
          isPrime = false;
          break;
        }
      }
      if (isPrime) {
        if (i < 8) {
          this._init[i] = frac(Math.pow(prime, 1 / 2));
        }
        this._key[i] = frac(Math.pow(prime, 1 / 3));
        i++;
      }
    }
  }

  /**
   * Perform one cycle of SHA-256.
   * @param {Uint32Array|BitArray} w one block of words.
   * @private
   */
  _block(w) {
    var i, tmp, a, b,
      h = this._h,
      k = this._key,
      h0 = h[0], h1 = h[1], h2 = h[2], h3 = h[3],
      h4 = h[4], h5 = h[5], h6 = h[6], h7 = h[7];
    /* Rationale for placement of |0 :
     * If a value can overflow is original 32 bits by a factor of more than a few
     * million (2^23 ish), there is a possibility that it might overflow the
     * 53-bit mantissa and lose precision.
     *
     * To avoid this, we clamp back to 32 bits by |'ing with 0 on any value that
     * propagates around the loop, and on the hash state h[].  I don't believe
     * that the clamps on h4 and on h0 are strictly necessary, but it's close
     * (for h4 anyway), and better safe than sorry.
     *
     * The clamps on h[] are necessary for the output to be correct even in the
     * common case and for short inputs.
     */
    for (i = 0; i < 64; i++) {
      // load up the input word for this round
      if (i < 16) {
        tmp = w[i];
      } else {
        a = w[(i + 1) & 15];
        b = w[(i + 14) & 15];
        tmp = w[i & 15] = ((a >>> 7 ^ a >>> 18 ^ a >>> 3 ^ a << 25 ^ a << 14) +
          (b >>> 17 ^ b >>> 19 ^ b >>> 10 ^ b << 15 ^ b << 13) +
          w[i & 15] + w[(i + 9) & 15]) | 0;
      }

      tmp = (tmp + h7 + (h4 >>> 6 ^ h4 >>> 11 ^ h4 >>> 25 ^ h4 << 26 ^ h4 << 21 ^ h4 << 7) + (h6 ^ h4 & (h5 ^ h6)) + k[i]); // | 0;

      // shift register
      h7 = h6; h6 = h5; h5 = h4;
      h4 = h3 + tmp | 0;
      h3 = h2; h2 = h1; h1 = h0;
      h0 = (tmp + ((h1 & h2) ^ (h3 & (h1 ^ h2))) + (h1 >>> 2 ^ h1 >>> 13 ^ h1 >>> 22 ^ h1 << 30 ^ h1 << 19 ^ h1 << 10)) | 0;
    }
    h[0] = h[0] + h0 | 0;
    h[1] = h[1] + h1 | 0;
    h[2] = h[2] + h2 | 0;
    h[3] = h[3] + h3 | 0;
    h[4] = h[4] + h4 | 0;
    h[5] = h[5] + h5 | 0;
    h[6] = h[6] + h6 | 0;
    h[7] = h[7] + h7 | 0;
  }

  static hash(data) {
    return (new SHA256()).update(data).finalize();
  }

}

export default SHA256;