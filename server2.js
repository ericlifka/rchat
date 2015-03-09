var fs = require('fs');
var path = require('path');
var https = require('https');
var express = require('express');
var httpProxy = require('http-proxy');

var httpsOptions = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
};

var defaultTarget = {
    name: 'Staging     - https://localhost:8000/sca/',
    host: 'https://apps.ininsca.com',
    carrierPigeon: 'wss://carrier-pigeon.us-east-1.ininsca.com'
};

var uiHost = "http://localhost:4200";

var app = express();

var proxyTarget;

var proxy = httpProxy.createProxyServer({
    target: defaultTarget.host,
    ws: true,
    secure: false
});

var proxyHttp = function (req, res) {
    var target;

    proxyTarget = defaultTarget;
    target = proxyTarget.host;

    proxy.web(req, res, {
        target: target
    });
};

var proxyUi = function (req, res) {
    proxy.web(req, res, {
        target: uiHost
    });
};

var proxyWebsocket = function (req, socket, head) {
    var target;

    console.log('Upgrade websocket', req.url, proxyTarget);

    if (!proxyTarget) {
        proxyTarget = defaultTarget;
    }

    target = proxyTarget.host;

    proxy.ws(req, socket, head, {
        target: target
    });
};

proxy.on('error', function (e) {
    console.log('Error while trying to proxy. Check internet connection.');
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
