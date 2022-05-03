const WebSocket = require("ws");

const {MIN_APPROVALS} = require("./Config");

const p2p_port = process.env.P2P_PORT || 5001;

const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];
var CircularJSON = require('circular-json');

const MESSAGE_TYPE = {
    transaction: "TRANSACTION",
    prepare: "PREPARE",
    pre_prepare: "PRE-PREPARE",
    commit: "COMMIT",
    round_change: "ROUND_CHANGE"
};

class P2PServer{
    constructor(blockchain, transactionPool, wallet, blockPool, preparePool, commitPool, messagePool, validators){
        this.blockchain = blockchain;
        this.sockets = [];
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.blockPool = blockPool;
        this.preparePool = preparePool;
        this.commitPool = commitPool;
        this.messagePool = messagePool;
        this.validators = validators;
    }

    listen(){
        var server = new WebSocket.Server({port: p2p_port});
        server.on("connection", socket => {
            console.log("new connection");
            this.connectSocket(socket);
        });
        this.connectToPeers();
        console.log(`Listening for peer to peer connection on ${p2p_port}`);
    }

    connectSocket(socket){
        this.sockets.push(socket);
        console.log("Socket connected");
        this.messageHandler(socket);
    }

    connectToPeers(){
        peers.forEach(peer => {
            const socket = new WebSocket(peer);
            socket.on("open", () => this.connectSocket(socket));
        });
    }

    broadcastTransaction(transaction){
        this.sockets.forEach(socket => {
            this.sendTransaction(socket, transaction);
        });
    }

    sendTransaction(socket, transaction){
        socket.send(
            CircularJSON.stringify({
                type: MESSAGE_TYPE.transaction,
                transaction: transaction
            })
        );
    }

    broadcastPrePrepare(block){
        this.sockets.forEach(socket => {
            this.sendPrePrepare(socket, block);
        });
    }

    sendPrePrepare(socket, block){
        socket.send(
            CircularJSON.stringify({
                type: MESSAGE_TYPE.pre_prepare,
                block: block
            })
        );
    }

    broadcastPrepare(prepare){
        this.sockets.forEach(socket => {
            this.sendPrepare(socket, prepare);
        });
    }
    
    sendPrepare(socket, prepare){
        socket.send(
            CircularJSON.stringify({
                type: MESSAGE_TYPE.prepare,
                prepare: prepare
            })
        );
    }
    
    broadcastCommit(commit) {
        this.sockets.forEach(socket => {
            this.sendCommit(socket, commit);
        });
    }
    
    sendCommit(socket, commit){
        socket.send(
            CircularJSON.stringify({
            type: MESSAGE_TYPE.commit,
            commit: commit
            })
        );
    }
    
    broadcastRoundChange(message){
        this.sockets.forEach(socket => {
            this.sendRoundChange(socket, message);
        });
    }
    
    sendRoundChange(socket, message){
        socket.send(
            CircularJSON.stringify({
            type: MESSAGE_TYPE.round_change,
            message: message
            })
        );
    }

    messageHandler(socket){
        socket.on("message", message =>{
            var data = JSON.parse(message);
            console.log("Received", data.type);

            switch(data.type){
                case MESSAGE_TYPE.transaction:
                    if(
                        !this.transactionPool.transactionExists(data.transaction)&&
                        this.transactionPool.verifyTransaction(data.transaction)&&
                        this.validators.checkValidatorValid(data.transaction.from)
                    ){  
                        var threshold = this.transactionPool.addTransaction(data.transaction);
                        this.broadcastTransaction(data.transaction);

                        if(threshold == true){
                            console.log("Threshold reahced, creating new block...");
                            if(this.blockchain.getProposer() === this.wallet.getPublicKey()){
                                console.log("Proposing block...");

                                var block = this.blockchain.createBlock(this.transactionPool.transactions, this.wallet, this.transactionPool.tree.rootNode.data, this.transactionPool.filter);
                                console.log("Block created...");
                                this.broadcastPrePrepare(block);
                            }
                        }else{
                            console.log("Transaction Added...");
                        }
                    }
                    break;
                case MESSAGE_TYPE.pre_prepare:
                    console.log(data.block); 
                    // console.log(this.blockchain.checkBlockValidity(data.block));
                    console.log(this.blockPool.existingBlock(data.block));
                    if(
                        !this.blockPool.existingBlock(data.block) && 
                        this.blockchain.checkBlockValidity(data.block)
                    ){
                        this.blockPool.addBlock(data.block);
                        console.log("HooAh" + data.block);
                        this.broadcastPrePrepare(data.block);

                        var prepare = this.preparePool.prepare(data.block, this.wallet);
                        this.broadcastPrepare(prepare);
                    }
                    break;
                case MESSAGE_TYPE.prepare:
                    if(
                        !this.preparePool.existingPrepare(data.prepare) &&
                        this.preparePool.checkValidPrepare(data.prepare) && 
                        this.validators.checkValidatorValid(data.prepare.publicKey)
                    ){
                        this.preparePool.addPrepare(data.prepare);
                        this.broadcastPrepare(data.prepare);
                        if(this.preparePool.list[data.prepare.blockHash].length >= MIN_APPROVALS){
                            
                            var commit = this.commitPool.commit(data.prepare, this.wallet);
                            this.broadcastCommit(commit);
                        }
                    }
                    break;
                case MESSAGE_TYPE.commit:
                    if( 
                        data.commit !== undefined &&
                        !this.commitPool.existingCommit(data.commit) &&
                        this.commitPool.isValidCommit(data.commit) &&
                        this.validators.checkValidatorValid(data.commit.publicKey)
                    ){
                        this.commitPool.addCommit(data.commit);
                        this.broadcastCommit(data.commit);

                        if(this.commitPool.list[data.commit.blockHash].length >= MIN_APPROVALS){
                            this.blockchain.addUpdatedBlock(
                                data.commit.blockHash,
                                this.blockPool,
                                this.preparePool,
                                this.commitPool
                            );
                        }
                        var message = this.messagePool.createMessage(
                            this.blockchain.chain[this.blockchain.chain.length - 1].currentHash,
                            this.wallet
                        );
                        this.broadcastRoundChange(message);
                    }
                    break;
                case MESSAGE_TYPE.round_change:
                    if (
                        !this.messagePool.existingMessage(data.message) &&
                        this.messagePool.isValidMessage(data.message) &&
                        this.validators.checkValidatorValid(data.message.publicKey)
                    ){
                        this.messagePool.addMessage(data.message);
            
                        this.broadcastRoundChange(data.message);
            
                        if (
                            this.messagePool.list[data.message.blockHash].length >=
                            MIN_APPROVALS
                        ) {
                            this.transactionPool.clear();
                            this.blockPool.clear();
                        }
                    }
                    break;
            }
        });
    }
}

module.exports = P2PServer;

