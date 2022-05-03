const EDDSA = require("elliptic").eddsa;

const eddsa = new EDDSA("ed25519");

const uuidv1 = require("uuid/v1");
const SHA256 = require('sha256');

class ChainUtil{
    static generateKeyPair(secretPhrase){
        return eddsa.keyFromSecret(secretPhrase);
    }

    static getId(){
        return uuidv1();
    }

    static getHash(data){
        return SHA256(JSON.stringify(data)).toString();
    }

    static verifySignature(publicKey, digitalSignature, dataHash){
        return eddsa.keyFromPublic(publicKey).verify(dataHash, digitalSignature);
    }
}

module.exports = ChainUtil;