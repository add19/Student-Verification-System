const ChainUtil = require("./ChainUtil");

class Transaction{
    constructor(data, wallet){
        this.id = ChainUtil.getId();
        this.from = wallet.publicKey;
        this.inputData = {data: data};
        this.hash = ChainUtil.getHash(this.inputData);
        this.signature = wallet.sign(this.hash);
    }
    
    static verifyTransaction(transaction){
        return ChainUtil.verifySignature(transaction.from, transaction.signature, ChainUtil.getHash(transaction.inputData));
    }
}

module.exports = Transaction;