var pdfcrowd = require("pdfcrowd");

// create the API client instance
var client = new pdfcrowd.HtmlToPdfClient(
    "add19", "6de406ab3c5b37f30ecdaac24c774eae");

// use predefined callback for saving to a file
var callbacks = pdfcrowd.saveToFile("example2.pdf");

// set custom error callback
callbacks.error = function(errMessage, statusCode) {
    if(statusCode) {
        console.error("Pdfcrowd Error: " + statusCode + " - " + errMessage);
    } else {
        console.error("Pdfcrowd Error: " + errMessage);
    }
};

// run the conversion and write the result to a file
client.convertUrl("https://en.wikipedia.org/wiki/PDF", callbacks);
