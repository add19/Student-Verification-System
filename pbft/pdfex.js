/* eslint-disable require-jsdoc */
// eslint-disable-next-line strict
var express = require('express');
var app = express();
const pdfshift = require('pdfshift')('4e7c052550824c539b8c3a2eebde4544');
const fs = require('fs');
var request = require('request');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var pdfcrowd = require("pdfcrowd");

// create the API client instance
var client = new pdfcrowd.HtmlToPdfClient(
    "add19", "6de406ab3c5b37f30ecdaac24c774eae");

app.use(bodyParser.urlencoded({ extended: true }));
app.post('/', function(req, res){
    console.log(req.body.yop + ' ' + req.body.prn);
    request(
        {
            uri: 'http://localhost:9005/transcript?passing='+ req.body.yop +'&roll=' + req.body.prn
        },
        function(error, response, body) {
            // console.log(body);
            
            fs.writeFile('transcript44.html',body, function(err){
                console.log("err...:" + err);
                client.convertFileToFile(
                    "/home/kratos/StudentVerification_V2/pbft/transcript44.html",
                    "MyLayout.pdf",
                    function(err, fileName) {
                        if (err) return console.error("Pdfcrowd Error: " + err);
                        console.log("Success: the file was created " + fileName);
                        // var transporter = nodemailer.createTransport({
                        //     service: 'Gmail',
                        //     auth: {
                        //         user: 'aadish.deshpande@gmail.com',
                        //         pass: 'aadish3809'
                        //     }
                        // });
                        // var mailOptions = {
                        //     from: 'aadish.deshpande@gmail.com',
                        //     to: 'aadish.deshpande@gmail.com',
                        //     subject: 'Here is the transcript',
                        //     text: 'Please download the attachment',
                        //     html: '<b>Please download the attachment</b>',
                        //     attachments: [
                        //         {
                        //             filename: 'result.pdf',
                        //             path: '/home/kratos/StudentVerification_V2/pbft/MyLayout.pdf',
                        //             contentType: 'application/pdf'
                        //         }
                        //     ]
                        // };
                        // transporter.sendMail(mailOptions, function(err, response){
                        //     if(err){
                        //         console.log(err);
                        //     }
                        //     console.log('Message sent: ' + response.message);
                        // });
                    });
            });
        }
    );
});


// function callbackFunction(email){
//     let data = fs.readFileSync('transcript44.html', 'utf8');
//     pdfshift.convert(data).then(function (binary_file) {
//         fs.writeFile('result1.pdf', binary_file, 'binary', function () {
            // var transporter = nodemailer.createTransport({
            //     service: 'Gmail',
            //     auth: {
            //         user: 'aadish.deshpande@gmail.com',
            //         pass: 'aadish3809'
            //     }
            // });
            // var mailOptions = {
            //     from: 'aadish.deshpande@gmail.com',
            //     to: email,
            //     subject: 'Here is the transcript',
            //     text: 'Please download the attachment',
            //     html: '<b>Please download the attachment</b>',
            //     attachments: [
            //         {
            //             filename: 'result.pdf',
            //             path: '/home/kratos/fabric-dev-servers/studentverification-network/result1.pdf',
            //             contentType: 'application/pdf'
            //         }
            //     ]
            // };
            // transporter.sendMail(mailOptions, function(err, response){
            //     if(err){
            //         console.log(err);
            //     }
            //     console.log('Message sent: ' + response.message);
            // });
//         });
//     }).catch(function() {});
// }

app.listen(9010, function(){
    console.log('PDF Generator Server active...');
});