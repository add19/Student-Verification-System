const express = require("express");
const app = express();
const mongoose = require("mongoose");

var mongodb = "mongodb://127.0.0.1/db1";
mongoose.connect(mongodb, {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

