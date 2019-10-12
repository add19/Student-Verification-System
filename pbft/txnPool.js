// const Transaction = require("./transaction");
// const { TRANSACTION_THRESHOLD } = require("./Config");

// class TransactionPool{
//     constructor(){
//         this.transactions = [];
//     }

//     addTransaction(transaction){
//         this.transactions.push(transaction);
//         if(this.transactions.length >= TRANSACTION_THRESHOLD){
//             return true;
//         }else{
//             return false;
//         }
//     }

//     verifyTransaction(transaction){
//         return Transaction.verifyTransaction(transaction);
//     }
//     transactionExists(transaction){
//         return this.transactions.find(t => t.id === transaction.id);
//     }
//     clear(){
//         console.log("Transaction Log Cleared...");
//         this.transactions = [];
//     }
// }

// module.exports = TransactionPool;


const Transaction = require("./transaction");

const { TRANSACTION_PER_BLOCK } = require("./Config");

class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
    if (this.transactions.length >= TRANSACTION_PER_BLOCK) {
      return true;
    } else {
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
    console.log("TRANSACTION POOL CLEARED");
    this.transactions = [];
  }
}

module.exports = TransactionPool;