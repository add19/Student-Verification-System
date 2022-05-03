
const ChainUtil = require("./ChainUtil");

class MessagePool {
    constructor() {
        this.list = {};
        this.message = "INITIATE NEW ROUND";
    }

    createMessage(blockHash, wallet) {
        var roundChange = {
            publicKey: wallet.getPublicKey(),
            message: this.message,
            signature: wallet.sign(ChainUtil.getHash(this.message + blockHash)),
            blockHash: blockHash
        };

        this.list[blockHash] = [roundChange];
        return roundChange;
    }

    existingMessage(message) {
        if (this.list[message.blockHash]) {
            var exists = this.list[message.blockHash].find(
                p => p.publicKey === message.publicKey
            );
            return exists;
        } else {
            return false;
        }
    }

    isValidMessage(message) {
        // console.log("in valid here");
        // console.log(message);
        return ChainUtil.verifySignature(message.publicKey, message.signature, ChainUtil.getHash(message.message + message.blockHash));
    }

    addMessage(message) {
        this.list[message.blockHash].push(message);
    }
}

module.exports = MessagePool;