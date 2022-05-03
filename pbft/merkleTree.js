var sha256 = require('sha256');
var MerkleNode = require('./merkleNode');

class MerkleTree{
    constructor(){
        this.nodes = [];
        this.leaves = [];
        this.rootNode = '';
    }
    clear(){
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
            console.log(this.nodes[i]);
        }
    }
}

module.exports = MerkleTree;