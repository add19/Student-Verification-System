var mongoose = require("mongoose");

var blockchainSchema = new mongoose.Schema({
    timestamp: String,
    previousHash: String,
    hash: String,
    data: Object,
    blockProposer: String,
    signature: String,
    sequenceNo: mongoose.Schema.Types.Number,
    merkleRoot: String,
    bloomFilter: Object
});

module.exports = mongoose.model("Blockchain", blockchainSchema);