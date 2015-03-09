var fs = require('fs');
var path = require('path');
var https = require('https');
var express = require('express');
var httpProxy = require('http-proxy');

var directory = 'https://apps.ininsca.com';
var broccoli = 'http://localhost:4200';
var httpsOptions = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
};

var app = express();
var proxy = httpProxy.createProxyServer({
    ws: true,
    secure: false
});

var proxyHttp = function (req, res) {
    proxy.web(req, res, {
        target: directory
    });
};

var proxyUi = function (req, res) {
    proxy.web(req, res, {
        target: broccoli
    });
};

var proxyWebsocket = function (req, socket, head) {
    proxy.ws(req, socket, head, {
        target: directory
    });
};

proxy.on('error', function (e) {
    console.log('Proxy error: ', e);
});

app.all('/api/*', proxyHttp);
app.all('/platform/api/*', proxyHttp);
app.all('/directory/api/*', proxyHttp);
app.all('/realtime/*', proxyHttp);
app.all('/sessions/*', proxyHttp);
app.all('/services/*', proxyHttp);
app.all('/admin/*', proxyHttp);
app.all('/*', proxyUi);

var server = https.createServer(httpsOptions, app);

server.on('upgrade', proxyWebsocket);

var port = 3000;
server.listen(port);

console.log('Serving SSL from:', port);
