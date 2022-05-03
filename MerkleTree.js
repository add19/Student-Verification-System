var sha256 = require('js-sha256');

class MerkleHash{
    ComputeHash(value){
        var SHA256 = sha256(value);
        var hashValue = sha256(SHA256);
        return hashValue;
    }
    CompareHash(hash1, hash2){
        return hash1 === hash2;
    }
    CombinedHash(hash1, hash2){
        var finalPreHash = hash1 + hash2;
        var finalHash = this.ComputeHash(finalPreHash);
        return finalHash;
    }
}

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

class MerkleTree{
    constructor(){
        this.nodes = [];
        this.leaves = [];
        this.rootNode = '';
    }
    AppendNode(merkleNode){
        this.nodes.push(merkleNode);
        this.leaves.push(merkleNode);
    }
    AppendHash(merkleHash){
        var node = new MerkleNode(merkleHash);
        this.nodes.push(node);
        this.leaves.push(node);
    }
    ConstructTree(){
        if(this.leaves.length != 0){
            this.BuildTree(this.leaves);
        }
    }
    BuildTree(nodes){
        if(nodes.length == 1){
            this.rootNode = nodes[0];
            return;    
        }else{
            var parents = [];

            for(var i=0; i<nodes.length; i=i+2){
                var right = null;
                if(i + 1 < nodes.length){
                    right = nodes[i + 1];
                }else{
                    right = nodes[i];
                    right.direction = 'left';
                }
                var parent = new MerkleNode(0);
                var parentNode = parent.CreateCombinedNode(nodes[i], right);
                parents.push(parentNode);
                nodes[i].parent = parentNode;
                nodes[i].direction = 'left';
                parentNode.left = nodes[i];
                if(right!=null){
                    right.parent = parentNode;
                    right.direction = 'right';
                    parentNode.right = right;
                }
            }
            this.BuildTree(parents);
        }
    }
    FindLeaf(leafHash){
        for(var i=0; i<this.leaves.length; i++){
            if(this.leaves[i].data == leafHash){
                return this.leaves[i];
            }
        }
        return null;
    }
    AuditProof(leafHash){
        var auditTrail = [];
        var leafNode = this.FindLeaf(leafHash);
        if(leafNode != null){
            var parent = leafNode.parent;
            this.BuildAuditTrail(auditTrail, parent, leafNode);
        }
        return auditTrail;
    }
    BuildAuditTrail(auditTrail, parentNode, childNode){
        if(parentNode != null){
            var nextChild = parentNode.left == childNode ? parentNode.right : parentNode.left;
            
            if(nextChild != null){
                auditTrail.push(nextChild);
            }
            if(childNode.parent!=null)
                this.BuildAuditTrail(auditTrail, childNode.parent.parent, childNode.parent);
            else{
                return;
            }
        }
    }
    TreeTraversal(){
        for(var i=0; i<this.nodes.length; i++){
            console.log(this.nodes[i].data);
        }
    }
}

var tree = new MerkleTree();
var txn1 = 't1';
var txn2 = 't2';
var txn3 = 't3';
var txn4 = 't4';
var txn5 = 't5';
var txn6 = 't6';
var txn7 = 't7';
var txn8 = 't8';
var merkleHash = new MerkleHash();
var hash1 = merkleHash.ComputeHash(txn1);
var hash2 = merkleHash.ComputeHash(txn2);
var hash3 = merkleHash.ComputeHash(txn3);
var hash4 = merkleHash.ComputeHash(txn4);
var hash5 = merkleHash.ComputeHash(txn5);
var hash6 = merkleHash.ComputeHash(txn6);
var hash7 = merkleHash.ComputeHash(txn7);
var hash8 = merkleHash.ComputeHash(txn8);
tree.AppendHash(hash1);
tree.AppendHash(hash2);
tree.AppendHash(hash3);
tree.AppendHash(hash4);
tree.AppendHash(hash5);
tree.AppendHash(hash6);
tree.AppendHash(hash7);
tree.AppendHash(hash8);
tree.ConstructTree();
// console.log(tree.rootNode);
tree.TreeTraversal();
console.log("====================================================================================");
console.log("Merkle Proof of Transaction: " + txn7);
var trail = tree.AuditProof(hash7);
var currentHash = hash7;
console.log(trail);
for(var i=0; i<trail.length; i++){
    console.log(trail[i].data);
}
for(var i=0; i<trail.length; i++){
    // console.log(trail[i].data + " " + trail[i].direction);
    if(trail[i].direction == 'left'){
        currentHash = sha256(trail[i].data + currentHash);
    }else{
        currentHash = sha256(currentHash + trail[i].data);
    }
}
if(tree.rootNode.data == currentHash){
    console.log("Transaction Valid...");
    console.log("Generated Hash: " + currentHash);
    console.log("Merkle Root: " + tree.rootNode.data);
}else{
    console.log(currentHash);
}