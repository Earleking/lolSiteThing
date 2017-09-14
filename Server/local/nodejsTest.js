//nodejs Test
var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic("C:\Users\Arek Fielding\Documents\Development\Analysis Site\ajaxTest.html")).listen(8080, function(){
    console.log('Server running on 8080...');
});
