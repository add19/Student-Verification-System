var sha256 = require('sha256');

class MerkleNode{
    constructor(data, left = null, right = null, parent = null, direction = null){
        this.data = data;
        this.left = left;
        this.right = right;
        this.parent = parent;
        this.direction = direction;
    }
    CreateCombinedNode(leftNode, rightNode){
        var hash1 = leftNode.data;
        var hash2 = rightNode.data;
        // console.log(sha256(hash1 + hash2));
        var newNode = new MerkleNode(sha256(hash1 + hash2));
        return newNode;
    }
}

module.exports = MerkleNode;