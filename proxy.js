var fs = require('fs');
var path = require('path');
var https = require('https');
var express = require('express');
var httpProxy = require('http-proxy');

var config = {
    port: 3000,
    hosts: {
        directory: 'https://apps.ininsca.com',
        broccoli: 'http://localhost:4200'
    },
    https: {
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.crt')
    },
    proxy: {
        ws: true,
        secure: false
    }
};

var proxy = httpProxy.createProxyServer(config.proxy);
var proxies = {
    directory: function (req, res) {
        proxy.web(req, res, {
            target: config.hosts.directory
        });
    },
    files: function (req, res) {
        proxy.web(req, res, {
            target: config.hosts.broccoli
        });
    },
    socket: function (req, socket, head) {
        proxy.ws(req, socket, head, {
            target: config.hosts.directory
        });
    }
};
proxy.on('error', function (e) {
    console.log('Proxy error: ', e);
});

var app = express();
app.all('/api/*', proxies.directory);
app.all('/platform/api/*', proxies.directory);
app.all('/directory/api/*', proxies.directory);
app.all('/realtime/*', proxies.directory);
app.all('/sessions/*', proxies.directory);
app.all('/services/*', proxies.directory);
app.all('/admin/*', proxies.directory);
app.all('/*', proxies.files);

var server = https.createServer(config.https, app);
server.on('upgrade', proxies.socket);
server.listen(config.port);

console.log('Serving SSL from: ' + config.port);
