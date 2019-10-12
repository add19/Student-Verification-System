const Block = require("./Block");

class BlockPool{
    constructor(){
        this.list = [];
    }
    
    existingBlock(block) {
        var exists = this.list.find(b => b.currentHash === block.currentHash);
        return exists;
    }
    
    addBlock(block){
        this.list.push(block);
        console.log("Block added to blockpool...");
    }
    clear(){
        this.list = [];
    }

    getBlock(hash){
        return this.list.find(blocks => blocks.currentHash === hash);
    }
}

module.exports = BlockPool;