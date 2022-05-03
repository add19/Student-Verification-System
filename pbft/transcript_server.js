/* eslint-disable require-jsdoc */
// eslint-disable-next-line strict
var express = require('express');
var app = express();
var firebase = require('firebase');
// var SendOtp = require('sendotp');
const querystring = require('querystring');
// const sendOtp = new SendOtp('272321AXY7XYHanDr5cb2ac6f');
firebase.initializeApp({
    apiKey: 'AIzaSyCw3PQASUjZUkT0tRIymBf7kAYSFKLr054',
    serviceAccount: 'transcript-f3df4-6b5f8c5e222e.json',
    databaseURL: 'https://transcript-f3df4.firebaseio.com/'
});
var request = require('request');

app.set('view engine', 'ejs');

var db = firebase.database();
var ref = db.ref('/');
var searchBy = '2019-2020';
var searchPRN = '2016BTEIT00058';
app.get('/', function(req, res){
    res.sendFile('transEssential.html',  {root: __dirname });
});
app.get('/transcript', function(req, res) {
    //retrieve this data from firebase
    console.log(searchBy + ' ' + searchPRN);
    ref.once('value', function(snapshot){
        var data = snapshot.val();
        searchBy = req.query.passing;
        searchPRN = req.query.roll;
        var email = data[searchBy][searchPRN]['email'];
        var sem1Data = data[searchBy][searchPRN]['FY-I'];
        var sem2Data = data[searchBy][searchPRN]['FY-II'];
        var sem3Data = data[searchBy][searchPRN]['SY-I'];
        var sem4Data = data[searchBy][searchPRN]['SY-II'];
        var subjects1 = [];
        var subjects2 = [];
        var subjects3 = [];
        var subjects4 = [];
        for(var k in sem1Data){
            subjects1.push(k);
        }
        for(var l in sem2Data){
            subjects2.push(l);
        }
        for(var m in sem3Data){
            subjects3.push(m);
        }
        for(var n in sem4Data){
            subjects4.push(n);
        }
        // console.log(subjects);

        var transcriptSubject1 = [];
        var transcriptSubject2 = [];
        var transcriptSubject3 = [];
        var transcriptSubject4 = [];
        for(var i in subjects1){
            // console.log(semData[subjects[i]].credits.lecture);
            //create the js object
            transcriptSubject1.push({
                course_title: subjects1[i],
                course_code: sem1Data[subjects1[i]].code,
                grade: sem1Data[subjects1[i]].grade,
                credits: {lab: sem1Data[subjects1[i]].credits.lab, lect: sem1Data[subjects1[i]].credits.lecture, tut:sem1Data[subjects1[i]].credits.tutorial}
            });
        }

        // eslint-disable-next-line no-redeclare
        for(var i in subjects2){
            // console.log(semData[subjects[i]].credits.lecture);
            //create the js object
            transcriptSubject2.push({
                course_title: subjects2[i],
                course_code: sem2Data[subjects2[i]].code,
                grade: sem2Data[subjects2[i]].grade,
                credits: {lab: sem2Data[subjects2[i]].credits.lab, lect: sem2Data[subjects2[i]].credits.lecture, tut:sem2Data[subjects2[i]].credits.tutorial}
            });
        }

        // eslint-disable-next-line no-redeclare
        for(var i in subjects3){
            // console.log(semData[subjects[i]].credits.lecture);
            //create the js object
            transcriptSubject3.push({
                course_title: subjects3[i],
                course_code: sem3Data[subjects3[i]].code,
                grade: sem3Data[subjects3[i]].grade,
                credits: {lab: sem3Data[subjects3[i]].credits.lab, lect: sem3Data[subjects3[i]].credits.lecture, tut:sem3Data[subjects3[i]].credits.tutorial}
            });
        }

        // eslint-disable-next-line no-redeclare
        for(var i in subjects4){
            // console.log(semData[subjects[i]].credits.lecture);
            //create the js object
            transcriptSubject4.push({
                course_title: subjects4[i],
                course_code: sem4Data[subjects4[i]].code,
                grade: sem4Data[subjects4[i]].grade,
                credits: {lab: sem4Data[subjects4[i]].credits.lab, lect: sem4Data[subjects4[i]].credits.lecture, tut:sem4Data[subjects4[i]].credits.tutorial}
            });
        }
        var student_details = {
            year_of_passing: searchBy,
            prn: searchPRN, 
            email: email
        };
        console.log(student_details);
        res.render('pages/index', {
            studentDetails: student_details,
            subjectInfo1: transcriptSubject1,
            subjectInfo2: transcriptSubject2,
            subjectInfo3: transcriptSubject3,
            subjectInfo4: transcriptSubject4
        });
    });
});

function callBack(req, res){
    console.log(searchBy);
    var object = {
        prn: '2016BTEIT00044',
        yop: '2019-2020'
    };
    request({
        url: 'http://localhost:9010/',
        method: 'POST',
        json: object
    },function(err, res, body){
        console.log(err);
    });
}
app.listen(9005, function(){
    console.log('Transcript Server active...');
});