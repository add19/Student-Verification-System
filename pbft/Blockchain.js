const {NUMBER_OF_NODES} = require("./Config");

const Block = require("./Block");
const blockchain = require("./models/blockchain");

class Blockchain{
    constructor(validators){
        this.validatorList = validators.generateAddresses(NUMBER_OF_NODES);
        this.chain = [Block.getGenesisBlock()];
    }

    addBlock(block){
        this.chain.push(block);
        blockchain.create(block, function(err, blockAdded){
            if(err){
                console.log(err);
            }else{
                console.log("Following block has been added successflly: " + blockAdded);
            }
        });
        console.log("Block added...");
    }

    createBlock(transactions, wallet, merkleTree, bloomFilter){
        var block = Block.createBlock(this.chain[this.chain.length - 1], transactions, wallet, merkleTree, bloomFilter);
        return block;
    }
    getProposer(){
        let index = this.chain[this.chain.length - 1].currentHash[0].charCodeAt(0) % NUMBER_OF_NODES;
        return this.validatorList[index];   
    }

    checkBlockValidity(block){
        var prevBlock = this.chain[this.chain.length - 1];
        if( 
            block.currentHash === Block.blockHash(block) &&
            Block.verifyBlock(block) && 
            Block.verifyProposer(block, this.getProposer())
        ){
            console.log("Block valid...");
            return true;
        }else{
            console.log("Block Invalid...");
            return false;
        }
    }

    addUpdatedBlock(hash, blockPool, preparePool, commitPool){
        var block = blockPool.getBlock(hash);
        block.prepareMessages = preparePool.list[hash];
        block.commitMessages = commitPool.list[hash];
        this.addBlock(block);
    }
}

module.exports = Blockchain;