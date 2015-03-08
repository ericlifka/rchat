var express = require('express');
var request = require('request');
var apiUrl = "https://apps.ininsca.com";

var app = express();
app.use('/api', function (req, res) {
    var url = apiUrl + req.url;
    req.pipe(request(url)).pipe(res);
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
