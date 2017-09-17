var express = require("express");
var app = express();
var path = require('path');

//app.use(express.static('ajaxTest.html'));
app.use(express.static(path.join(__dirname, '/local')));
app.use(express.static(path.join(__dirname, "/../FrontEnd")));
app.get('/', function (req, res) {
    try {
        //muahahaha, now this is on the defualt page. Finally got it working
        //res.sendFile('Users\\Arek Fielding\\Documents\\Development\\Analysis Site\\FrontEnd\\playerPage.html', {'root': '/'}); 
        res.sendFile(path.join(__dirname, "/../FrontEnd/playerPage.html").substr(3), {'root': '/'});
        
    } catch (error) {
        console.log(error);
    }

});
app.get('/request' , function(req, res) {
    console.log('request received');
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("This is a response to your request");
});
app.get('/hello', function(req, res) {
    //There you go. This grabs region
    res.send(req.query.region);
});

app.get('/playerPage', function (req, res) {
    console.log('hello');
    console.log(res.getHeader('summName'));
});
var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("Example app listening at http://localhost:", port);
});