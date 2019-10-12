const Transaction = require("./transaction");
const ChainUtil = require("./ChainUtil");

class PreparePool{
    constructor(){
        this.list = {};
    }

    prepare(block, wallet){
        var prepare = this.createPrepare(block, wallet);
        this.list[block.currentHash] = [];
        this.list[block.currentHash].push(prepare);
        return prepare;
    }

    createPrepare(block, wallet){
        var prepare = {
            blockHash: block.currentHash,
            publicKey: wallet.getPublicKey(),
            signature: wallet.sign(block.currentHash)
        }
        return prepare;
    }

    addPrepare(prepare){
        this.list[prepare.blockHash].push(prepare);
    }

    existingPrepare(prepare) {
        var exists = this.list[prepare.blockHash].find(
          p => p.publicKey === prepare.publicKey
        );
        return exists;
    }

    checkValidPrepare(prepare){
        return ChainUtil.verifySignature(prepare.publicKey, prepare.signature, prepare.blockHash);
    }
}

module.exports = PreparePool;