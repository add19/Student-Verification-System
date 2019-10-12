const ChainUtil = require("./ChainUtil");
const Transaction = require("./transaction");

class Wallet{
    constructor(secret){
        this.keyPair = ChainUtil.generateKeyPair(secret);
        this.publicKey = this.keyPair.getPublic("hex");
    }

    toString(){
        return `Wallet - publicKey: ${this.publicKey.toString()}`;
    }

    sign(dataHash){
        return this.keyPair.sign(dataHash).toHex();
    }

    createTransaction(data){
        return new Transaction(data, this);
    }

    getPublicKey(){
        return this.publicKey;
    }
}

module.exports = Wallet;