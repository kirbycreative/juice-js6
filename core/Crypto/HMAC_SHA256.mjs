import HMAC from './hmac.mjs';
import HEX from './HEX.mjs';
import UTF8String from './UTF8String.mjs';

class HMAC_SHA256 {

  static create(sharedSecret, string) {
    var hmac = new HMAC(UTF8String.toBits(sharedSecret));
    return HEX.fromBits(hmac.encrypt(string));
  }

}

export default HMAC_SHA256;
