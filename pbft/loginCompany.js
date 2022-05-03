// eslint-disable-next-line strict
var express   = require('express');
var app       = express();
var bodyParser= require('body-parser');
var sha256    = require('sha256');
var firebase  = require('firebase');
var path = require('path');
var fs = require('fs');
var blockchain = require("./models/blockchain");
var BloomFilter = require("./bloomFilter");
const url = require('url');    
app.use(bodyParser.urlencoded({ extended: true }));



firebase.initializeApp({
    apiKey: 'AIzaSyCw3PQASUjZUkT0tRIymBf7kAYSFKLr054',
    serviceAccount: './studentassetverification-c5294f798f54.json',
    databaseURL: 'https://studentassetverification.firebaseio.com/'
});

var db = firebase.database();
var ref = db.ref('/');
let key = 0;

app.get('/', function(req, res){
    if(firebase.auth().currentUser !== null){
        app.use(express.static(path.join( __dirname, '/Login_v3')));
        res.sendFile( path.join( __dirname, 'Login_v3', 'index1.html' ));
    }else{
        res.redirect('/login');
    }
});

app.get('/login', function(req, res){
    app.use(express.static(path.join( __dirname, '/Login_v3')));
    res.sendFile( path.join( __dirname, 'Login_v3', 'Index.html' ));
});

app.get('/signup', function(req, res){
    res.sendFile( path.join( __dirname, 'Login_v3', 'indesxSignup.html' ));
});

app.post('/verify', function(req, res){
    //get form data
    var mainString  = req.body.prn + req.body.cpi + req.body.bcode;
    var queryString = sha256(JSON.stringify({data: mainString}));
    var logObj = {
        id: Date.now(), 
        prn: req.body.prn,
        cpi: req.body.cpi,
        queryString: queryString
    };
    fs.appendFile('request_log.txt', JSON.stringify(logObj), function(err){
        if(err) throw err;
        console.log('log addition complete');
    });
    // console.log(mainString);
    //create hash of the data
    //logic for selecting a running server should be there
    res.redirect("http://localhost:3001/verify?valid=" + queryString);
});

app.post('/signin', function(req, res){
    var email = req.body.email;
    var password  = req.body.pass;
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error){
        console.log(error);
    });
    console.log('Signed In!');
    res.redirect('/');
});

app.post('/login', function(req, res){
    var email = req.body.email;
    var pass  = req.body.pass;
    firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error){
        console.log('Got an error: ' + error);
    });
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            console.log('Logged in as: ' + user.email);
            res.redirect('/');
        }else{
            console.log('User signed out');
            // res.send("Logged out")
        }
    });

});


app.listen(30008, function(){
    console.log('Authentication Server active...');
});