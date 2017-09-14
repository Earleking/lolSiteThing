var express = require("express");
var app = express();
var path = require('path');

//app.use(express.static('ajaxTest.html'));
app.use(express.static(path.join(__dirname, '/local')));
app.use(express.static(path.join(__dirname, "/../FrontEnd")));
app.get('/', function (req, res) {
    try {
        //res.sendFile('ajaxTest.html', {'root': '/'}); 

    } catch (error) {
        console.log(error);
    }
    //console.log(__dirname + '/../testing.html');
    res.send('Hello World');
    console.log("hello world");
   ///console.log(req);
});

app.get('/hello', function(req, res) {
    console.log("AYYYYY");
    res.send("o");
});

var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("Example app listening at http://localhost:", port);
});