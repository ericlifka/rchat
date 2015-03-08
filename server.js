var express = require('express');
var request = require('request');
var http = require('http');
var httpProxy = require('http-proxy');

var apiUrl = "https://apps.ininsca.com";
var realtimeUrl = apiUrl + "/realtime";
var uiUrl = "http://localhost:4200";

var app = express();
//var proxy = httpProxy.createProxyServer({
//    target: {
//        host: realtimeUrl,
//        port: 80
//    },
//    ws: true
//});

app.use('/directory-api', function (req, res) {
    var url = apiUrl + req.url;
    console.log('forwarding request to: ' + url);
    req.pipe(request(url)).pipe(res);
});
app.use('/realtime', function (req, res) {
    var url = realtimeUrl + req.url;
    console.log('\nforwarding:\n  ' + req.url + '\nto:\n  ' + url);
    req.pipe(request(url)).pipe(res);
});
app.use('/app', function (req, res) {
    var url = uiUrl + req.url;
    req.pipe(request(url)).pipe(res);
});

var server = http.createServer(app);
//server.on('upgrade', function (req, socket, head) {
//    proxy.ws(req, socket, head);
//});

server.listen(3000);

var host = server.address().address;
var port = server.address().port;
console.log('Proxy server listenting at http://%s:%s', host, port);
