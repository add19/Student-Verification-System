const express = require("express");
const Wallet = require("./Wallet");
const bodyParser = require("body-parser");
const TransactionPool = require("./txnPool");
const P2pserver = require("./p2pServer");
var sha256    = require('sha256');
const url = require('url'); 
const Validators = require("./Validator");
const Blockchain = require("./Blockchain");
const BlockPool = require("./BlockPool");
const CommitPool = require("./CommitPool");
const PreparePool = require("./PreparePool");
const MessagePool = require("./MessagePool");
const { NUMBER_OF_NODES } = require("./Config");
const HTTP_PORT = process.env.HTTP_PORT || 3001;
var path = require('path');
var mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/BC4");
// mongoose.connect("mongodb://127.0.0.1:27017/requests");
var BlockchainInstance = require("./models/blockchain");
var RequestInstance = require("./models/requests");
const app = express();
var MerkleTree = require("./merkleTree");
var BloomFilter = require("./bloomFilter");
var cloudinary = require('cloudinary');
var multer = require('multer');
var fs = require('fs');
var Memcached = require('memcached');
var memcached = new Memcached('localhost:11211');
memcached.connect( 'localhost:11211', function( err, conn ){
  if( err ) {
    console.log( conn.server,'error while memcached connection!!');
  }else{
    console.log("Connected to memcache server... ", conn.server);
  }
});
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
var storage = multer.diskStorage({
  filename: function(req, file, callback){
      callback(null, Date.now() + file.originalname);
  }
});

var imageFilter = function(req, file, cb){
  if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)){
      return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

cloudinary.config({
  cloud_name: 'dfxj4outa',
  api_key: '453999375899534',
  api_secret: 'qr7Q7uznxn3C0tXfx1aG6InsgtY'
});

var upload = multer({storage: storage, filter: imageFilter});

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

app.get("/verify", (req, res) => {
  var filter = new BloomFilter();
  filter.hash(req.query.valid);
  var cache_data_status = "INVALID";
  var filterToVerify = filter.getFilter();
  memcached.get(req.query.valid, function(err, data){
        if(data != undefined){
          cache_data_status = "VALID";
          console.log("NEW DATA: " + data);
          console.log("THE STUDENT RECORD IS VALID...");
          res.write(
            '<html><body>VALID</body></html>');
        }
  });
  if(cache_data_status == "INVALID"){
    BlockchainInstance.find({}, function(err, blocks){
      if(err){
          console.log(err);
      }else{
          var merkleRoots = [];
          blocks.forEach(function(block){
            var arr = block.bloomFilter.array;
            merkleRoots.push(block.merkleRoot);  
            boolValue = BloomFilter.checkFilter(filterToVerify, arr);
            if(boolValue){
              var tree = new MerkleTree();
              
              block.data.forEach(function(blockData){
                tree.AppendHash(blockData.hash);
              });
              
              tree.ConstructTree();
              
              var currentHash = req.query.valid;
              
              var trail = tree.AuditProof(currentHash);
              
              for(var i=0; i<trail.length; i++){
                if(trail[i].direction == 'left'){
                    currentHash = sha256(trail[i].data + currentHash);
                }else{
                    currentHash = sha256(currentHash + trail[i].data);
                }
              }

              var status = "INVALID";
              for(var i=0; i<merkleRoots.length; i++){
                if(merkleRoots[i] == currentHash){
                  console.log("THE STUDENT RECORD IS VALID...");
                  status = "VALID";
                  res.write(
                    '<html> <head> <title>Sucess!</title> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css"> <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script> <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script> <style>body {font-family: Arial, Helvetica, sans-serif;} #myImg {  border-radius: 5px; cursor: pointer; transition: 0.3s; }#myImg:hover {opacity: 0.7;} .modal display: none; position: fixed; /* Stay in place */ z-index: 1; /* Sit on top */padding-top: 100px; /* Location of the box */left: 0;top: 0;width: 100%; /* Full width */height: 100%; /* Full height */overflow: auto; /* Enable scroll if needed */background-color: rgb(0,0,0); /* Fallback color */background-color: rgba(0,0,0,0.9); /* Black w/ opacity */}/* Modal Content (image) */.modal-content {margin: auto; display: block;width: 80%;max-width: 700px;} #caption { margin: auto; display: block; width: 80%; max-width: 700px; text-align: center; color: #ccc; padding: 10px 0; height: 150px; } .modal-content, #caption {  -webkit-animation-name: zoom;-webkit-animation-duration: 0.6s; animation-name: zoom; animation-duration: 0.6s;  } .close {position: absolute;top: 15px; right: 35px; color: #f1f1f1;font-size: 40px; font-weight: bold; transition: 0.3s; } .close:hover, .close:focus {color: #bbb; text-decoration: none; cursor: pointer;} </style></head> <div class="alert alert-success"> <strong>Success!</strong> The student details are valid, here is the actual report card: <a href=# class="alert-link">Grade Card</a>.</div>');
                }
              }
              if(status == "INVALID"){
                //check cache for record in transaction pool before sending failiure status
                console.log("THE STUDENT RECORD IS INVALID...");
                res.write('<html> <head> <title>Invalid fields!</title> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css"> <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script> <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script> </head> <div class="alert alert-danger"> <strong>Oops!</strong> The student details are invalid!</div>');
              }
              //create seperate log for pool verification
              var timestamp = Date.now();
              var validlogObj = {
                id: timestamp,
                transaction: currentHash,
                server_node: HTTP_PORT
              };
              fs.appendFile('valid-log.txt', JSON.stringify(validlogObj), function(err){
                if(err) throw err;
                console.log('valid log added');
              });
              var reqObj = new RequestInstance({
                timestamp: timestamp,
                transaction: currentHash,
                status: status
              });
              reqObj.save().then(result => console.log(result)).catch(err => console.log(err));
            }
            else{
              //res.send('<html> <head> <title>Invalid fields!</title> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css"> <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script> <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script> </head> <div class="alert alert-danger"> <strong>Oops!</strong> The student details are invalid!</div>');
              var reqObj = new RequestInstance({
                timestamp: Date.now(),
                transaction: currentHash,
                status: "INVALID"
              });
              reqObj.save().then(result => console.log("Inserted: " + result)).catch(err => console.log(err));
              var invalidlogObj = {
                id: Date.now(),
                transaction: currentHash,
                server_node: HTTP_PORT
              };
              fs.appendFile('invalid-log.txt', JSON.stringify(invalidlogObj), function(err){
                if(err) throw err;
                console.log('invalid log added');
              });
            }
          });
      }
    });
  }
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