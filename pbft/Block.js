const SHA256 = require("sha256");
const ChainUtil = require("./ChainUtil");

class Block{
    constructor(timestamp, previousHash, currentHash, data, blockProposer, signature, sequenceNo){
        this.timestamp = timestamp;
        this.currentHash = currentHash;
        this.previousHash = previousHash;
        this.data = data;
        this.blockProposer = blockProposer;
        this.signature = signature;
        this.sequenceNo = sequenceNo;
    }


    toString() {
        return `Block - 
            Timestamp   : ${this.timestamp}
            Last Hash   : ${this.previousHash}
            Hash        : ${this.currentHash}
            Data        : ${this.data}
            proposer    : ${this.blockProposer}
            Signature   : ${this.signature}
            Sequence No : ${this.sequenceNo}`;
    }

    static getGenesisBlock(){
        return new this(
            `0000000000`,
            "----",
            "genesis-hash",
            [],
            "AADISH",
            "ADD44",
            0
        );
    }

    static createBlock(previousBlock, data, wallet){
        var hash;
        var timestamp = Date.now();
        var previousHash = previousBlock.hash;
        hash = Block.hash(timestamp, previousHash, data);
        var blockProposer = wallet.getPublicKey();
        var signature = Block.signBlockHash(hash, wallet);

        return new this(
            timestamp,
            previousHash,
            hash,
            data,
            blockProposer,
            signature,
            previousBlock.sequenceNo + 1
        );  
    }

    static signBlockHash(hash, wallet){
        return wallet.sign(hash);
    }

    static hash(timestamp, previousHash, data){
        return SHA256(timestamp + previousHash + data);
    }

    static blockHash(block){
        const {timestamp, previousHash, data} = block;
        return Block.hash(timestamp, previousHash, data);
    }

    static verifyBlock(block){
        return ChainUtil.verifySignature(block.blockProposer, block.signature, Block.blockHash(block));
    }

    static verifyProposer(block, blockProposer){
        return block.blockProposer == blockProposer;
    }
}

module.exports = Block;