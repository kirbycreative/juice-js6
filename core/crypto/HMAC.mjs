import SHA256 from './HMAC_SHA256.mjs';

class HMAC {
  hash = null;
  baseHash = [];
  resultHash = null;
  updated = false;

  constructor(key, Hash) {
    this.hash = Hash || SHA256;
    var exKey = [[], []], i, bs = Hash.blockSize / 32;
    this.baseHash = [new Hash(), new Hash()];

    if (key.length > bs) key = Hash.hash(key);


    for (let i = 0; i < bs; i++) {
      exKey[0][i] = key[i] ^ 0x36363636;
      exKey[1][i] = key[i] ^ 0x5C5C5C5C;
    }

    this.baseHash[0].update(exKey[0]);
    this.baseHash[1].update(exKey[1]);

    this.resultHash = new Hash(this.baseHash[0]);
  }


  /** HMAC with the specified hash function.  Also called encrypt since it's a prf.
 * @param {bitArray|String} data The data to mac.
 */
  encrypt(data) {
    if (!this.updated) {
      this.update(data);
      return this.digest(data);
    } else {
      throw new Error("encrypt on already updated hmac called!");
    }
  };

  mac(data) {
    return this.encrypt(data);
  }


  reset() {
    this.resultHash = new this.hash(this.baseHash[0]);
    this.updated = false;
  }

  update(data) {
    this.updated = true;
    this.resultHash.update(data);
  }

  digest() {
    const w = this.resultHash.finalize();
    const result = new (this.hash)(this.baseHash[1]).update(w).finalize();
    this.reset();
    return result;
  }

}