const express = require("express");
const Wallet = require("./Wallet");
const bodyParser = require("body-parser");
const TransactionPool = require("./txnPool");
const P2pserver = require("./p2pServer");
var sha256    = require('sha256');
const Validators = require("./Validator");
const Blockchain = require("./Blockchain");
const BlockPool = require("./BlockPool");
const CommitPool = require("./CommitPool");
const PreparePool = require("./PreparePool");
const MessagePool = require("./MessagePool");
const { NUMBER_OF_NODES } = require("./Config");
const HTTP_PORT = process.env.HTTP_PORT || 3001;
var path = require('path');

const app = express();
// app.use(bodyParser.urlencoded({ extended: false }))

// app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const wallet = new Wallet(process.env.SECRET);
const transactionPool = new TransactionPool();
const validators = new Validators(NUMBER_OF_NODES);
const blockchain = new Blockchain(validators);
const blockPool = new BlockPool();
const preparePool = new PreparePool();
const commitPool = new CommitPool();
const messagePool = new MessagePool();
const p2pserver = new P2pserver(
  blockchain,
  transactionPool,
  wallet,
  blockPool,
  preparePool,
  commitPool,
  messagePool,
  validators
);

app.get("/", (req, res) => {
    app.use(express.static(__dirname + '/Login_v1'));
    res.sendFile( path.join( __dirname, 'Login_v1', 'index1.html' ));
});

app.get("/transactions", (req, res) => {
  res.json(transactionPool.transactions);
});

app.get("/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.post("/transact", (req, res) => {
    var data  = req.body.prn + req.body.cpi + req.body.bcode;
    const transaction = wallet.createTransaction(data);
    p2pserver.broadcastTransaction(transaction);
    res.redirect("/transactions");
});

app.listen(HTTP_PORT, () => {
  console.log(`Listening on port ${HTTP_PORT}`);
});

p2pserver.listen();