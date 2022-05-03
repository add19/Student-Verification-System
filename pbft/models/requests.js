var mongoose = require("mongoose");

var requestSchema = new mongoose.Schema({
    timestamp: String,
    transaction: String,
    status: String
});

module.exports = mongoose.model("Requests", requestSchema);