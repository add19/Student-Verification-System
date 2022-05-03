const Transaction = require("./transaction");
const { TRANSACTION_PER_BLOCK } = require("./Config");
var sha256 = require('sha256');
var Memcached = require('memcached');
var memcached = new Memcached('localhost:11211'); 
memcached.connect( 'localhost:11211', function( err, conn ){
    if( err ) {
      console.log( conn.server,'error while memcached connection!!');
    }else{
        console.log("Connected to memcache server... ", conn.server);
    }
});
class MerkleHash{
    ComputeHash(value){
      // SHA256(JSON.stringify(data)).toString()
        var SHA256 = sha256(JSON.stringify(value));
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

class BloomFilter{
  constructor(){
      this.array = Array(51).fill(0);
  }
  hash(string){
      for(var i=0;i<4; i++){
          // console.log(parseInt(SHA256(i.toString() + string), 16)%51);
          this.array[parseInt(sha256(i.toString() + string), 16)%51] = 1;
      }
  }
  printFilter(){
      for(var i=0;i<=50; i++){
          console.log(this.array[i]);
      }
  }
  checkFilter(bloomfilterArr){
      for(var i=0; i<=50; i++){
          if(bloomfilterArr[i] == 1 && this.array[i] != 1){
              console.log("Not present in this set");
              return;
          }
      }
      console.log("The element might be present in the filter...");
      return;
  }
  getFilter(){
      return this.array;
  }
  clearFilter(){
      this.array.fill(0);
  }
}

class TransactionPool {
  constructor() {
    this.transactions = [];
    this.tree = new MerkleTree();
    this.filter = new BloomFilter();
    this.merkleHash = new MerkleHash();
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
    // var txnHash = this.merkleHash.ComputeHash(transaction.inputData);
    this.tree.AppendHash(transaction.hash);
    this.filter.hash(transaction.hash);
    if (this.transactions.length >= TRANSACTION_PER_BLOCK) {
        this.tree.ConstructTree();
        console.log(this.tree.rootNode);
        return true;
    } else {
        //set the pool into in memory cache(use it for the verification first)
        memcached.set(transaction.hash, transaction.inputData, 2592000, function(err){
            if(err) throw new err;
        });
        memcached.get(transaction.hash, function(err, data){
            console.log(data);
        });
        return false;
    }
  }

  verifyTransaction(transaction) {
    return Transaction.verifyTransaction(transaction);
  }

  transactionExists(transaction) {
    let exists = this.transactions.find(t => t.id === transaction.id);
    return exists;
  }

  clear() {
    console.log("TRANSACTION POOL CLEARED" + this.tree);
    this.transactions = [];
    this.tree.clear();
    this.filter.clearFilter();
  }
}

module.exports = TransactionPool;