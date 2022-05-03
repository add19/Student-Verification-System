// eslint-disable-next-line strict
var express = require('express');
var app = express();
var firebase = require('firebase');
var bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
// function(err, str){
//     console.log(searchBy);
//     var object = {
//         prn: searchPRN,
//         yop: searchBy
//     };
//     request({
//         url: 'http://localhost:9010/',
//         method: 'POST',
//         json: object
//     },function(err, res, body){
//         console.log(err);
//     });
// });
firebase.initializeApp({
    apiKey: 'AIzaSyCwK-8f3cVQ_RAauuCHDqvXuzStV-XFGQY',
    serviceAccount: 'transcript-f3df4-6b5f8c5e222e.json',
    databaseURL: 'https://transcript-f3df4.firebaseio.com/'
});

var searchBy = '2019-2020';
var searchPRN = '2016BTEIT00044';
var searchSem = 'SY-II';
var db = firebase.database();
var ref = db.ref('/');
var path = require('path');

app.get('/', function(req, res){
    if(firebase.auth().currentUser !== null){
        res.sendFile('transcriptInput.html',  {root: __dirname });
    }else{
        res.redirect('/login');
    }
});

app.get('/login', function(req, res){
    res.sendFile('authTrans.html',  {root: __dirname });
});
app.post('/login', function(req, res){
    var email = req.body.username;
    var pass  = req.body.password;
    firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error){
        console.log('Got an error: ' + error);
    });
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            console.log('Logged in as: ' + user.email);
            res.redirect('/');
        }else{
            console.log('User signed out');
        }
    });

});


app.get('/edit', function(req, res){
    res.sendFile('editForm.html',  {root: __dirname });
});

app.post('/update', function(req, res){
    searchBy = req.body.passing;
    searchPRN = req.body.roll;
    searchSem = req.body.sem;

    ref.once('value', function(snapshot){
        var data = snapshot.val();
        var sem1Data = data[searchBy][searchPRN][searchSem];
        var subjects1 = [];
        for(var k in sem1Data){
            subjects1.push(k);
        }
        console.log(subjects1);
        var transcriptSubject1 = [];
        for(var i in subjects1){
            transcriptSubject1.push({
                course_title: subjects1[i],
                course_code: sem1Data[subjects1[i]].code,
                grade: sem1Data[subjects1[i]].grade,
                credits: {lab: sem1Data[subjects1[i]].credits.lab, lect: sem1Data[subjects1[i]].credits.lecture, tut:sem1Data[subjects1[i]].credits.tutorial}
            });
        }
        res.render('pages/edit', {
            subjectInfo: transcriptSubject1
        });
    });
});

app.post('/input', function(req, res){
    // console.log(req.body.grade1);
    var prn = req.body.p_r_n;
    var yop = req.body.y_o_p;
    var sem = req.body.sem;
    var branch = req.body.branch;
    var email = req.body.email;

    //subject 1 details
    var subject1 = req.body.subject1;
    var labcred_subject1 = req.body.labcred_subject1;
    var lcred_subject1 = req.body.lcred_subject1;
    var tcred_subject1 = req.body.tcred_subject1;
    var code1 = req.body.code1;
    var grade1 = req.body.grade1;
    // console.log(grade1);
    //subject 2 details
    var subject2 = req.body.subject2;
    var labcred_subject2 = req.body.labcred_subject2;
    var lcred_subject2 = req.body.lcred_subject2;
    var tcred_subject2 = req.body.tcred_subject2;
    var code2 = req.body.code2;
    var grade2 = req.body.grade2;

    //subject 3 details
    var subject3 = req.body.subject3;
    var labcred_subject3 = req.body.labcred_subject3;
    var lcred_subject3 = req.body.lcred_subject3;
    var tcred_subject3 = req.body.tcred_subject3;
    var code3 = req.body.code3;
    var grade3 = req.body.grade3;

    //subject 4 details
    var subject4 = req.body.subject4;
    var labcred_subject4 = req.body.labcred_subject4;
    var lcred_subject4 = req.body.lcred_subject2;
    var tcred_subject4 = req.body.tcred_subject4;
    var code4 = req.body.code4;
    var grade4 = req.body.grade4;

    //subject 5 details
    var subject5 = req.body.subject5;
    var labcred_subject5 = req.body.labcred_subject5;
    var lcred_subject5 = req.body.lcred_subject5;
    var tcred_subject5 = req.body.tcred_subject5;
    var code5 = req.body.code5;
    var grade5 = req.body.grade5;

    //subject 6 details
    var subject6 = req.body.subject6;
    var labcred_subject6 = req.body.labcred_subject6;
    var lcred_subject6 = req.body.lcred_subject6;
    var tcred_subject6 = req.body.tcred_subject6;
    var code6 = req.body.code6;
    var grade6 = req.body.grade6;

    firebase.database().ref('/' + yop + '/' + prn).update({
        [sem]: {
            [subject1]:{
                'code': code1,
                'grade': grade1,
                'credits':{
                    lab: Number(labcred_subject1),
                    lecture: Number(lcred_subject1),
                    tutorial:Number(tcred_subject1)
                }
            },
            [subject2]:{
                'code': code2,
                'grade': grade2,
                'credits':{
                    lab: Number(labcred_subject2),
                    lecture: Number(lcred_subject2),
                    tutorial:Number(tcred_subject2)
                }
            },
            [subject3]:{
                'code': code3,
                'grade': grade3,
                'credits':{
                    lab: Number(labcred_subject3),
                    lecture: Number(lcred_subject3),
                    tutorial: Number(tcred_subject3)
                }
            },
            [subject4]:{
                'code': code4,
                'grade': grade4,
                'credits':{
                    lab: Number(labcred_subject4),
                    lecture: Number(lcred_subject4),
                    tutorial: Number(tcred_subject4)
                }
            },
            [subject5]:{
                'code': code5,
                'grade': grade5,
                'credits':{
                    lab: Number(labcred_subject5),
                    lecture: Number(lcred_subject5),
                    tutorial: Number(tcred_subject5)
                }
            },
            [subject6]:{
                'code': code6,
                'grade': grade6,
                'credits':{
                    lab: Number(labcred_subject6),
                    lecture: Number(lcred_subject6),
                    tutorial: Number(tcred_subject6)
                }
            },
        },
        email: email
    }, function(err){
        if(err){
            res.send('<html> <head> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"> <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script> <title>Failiure to Upload!</title> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css"> <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script> <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script> </head> <nav> <div class="nav-wrapper"> <a href="#" class="brand-logo"></a> <ul id="nav-mobile" class="right hide-on-med-and-down"> <li><a href="/edit">Update</a></li> <li><a href="http://localhost:9004">Generate</a></li> <li><a href="http://localhost:9004">Get PDF</a></li> </ul> </div> </nav><div class="alert alert-danger"> <strong>Oops! Sorry we could not upload your information</strong></div>');
        }else{
            res.send('<html> <head> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"> <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script> <title>Sucess!</title> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css"> <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script> <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script> </head> <nav> <div class="nav-wrapper"> <a href="#" class="brand-logo"></a> <ul id="nav-mobile" class="right hide-on-med-and-down"> <li><a href="/edit">Update</a></li> <li><a href="http://localhost:9004">Generate</a></li> <li><a href="http://localhost:9004">Get PDF</a></li> </ul> </div> </nav> <div class="alert alert-success"> <strong>Success!</strong> Thank you for registering the information with us...</div>');
        }
    });
});

app.listen(9090, function(){
    console.log('Transcript Input Server active...');
});
