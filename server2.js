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

app.use(static({ urlRoot: '/dca', directory: 'dist' }));
app.use(static({ urlRoot: '/tca', directory: 'dist' }));
app.use(static({ urlRoot: '/sca', directory: 'dist' }));
app.use(static({ urlRoot: '/prod', directory: 'dist' }));

app.all('/api/*', proxyHttp);
app.all('/platform/api/*', proxyHttp);
app.all('/directory/api/*', proxyHttp);
app.all('/realtime/*', proxyHttp);
app.all('/sessions/*', proxyHttp);
app.all('/services/*', proxyHttp);
app.all('/admin/*', proxyHttp);

var server = https.createServer(httpsOptions, app);

server.on('upgrade', proxyWebsocket);

var port = 3000;
server.listen(port);

console.log('Serving SSL from:', port);

function static(options) {
    return function (req, res, next) { // Gotta catch 'em all (and serve index.html)
        var filePath = "";
        if (options.directory) {
            var regex = new RegExp('^' + (options.urlRoot || ''));
            // URL must begin with urlRoot's value
            if (!req.path.match(regex)) {
                next();
                return;
            }
            filePath = options.directory + req.path.replace(regex, '');
        } else if (options.file) {
            filePath = options.file;
        } else {
            throw new Error('static() isn\'t properly configured!');
        }

        fs.stat(filePath, function (err, stats) {
            if (err) {
                next();
                return;
            } // Not a file, not a folder => can't handle it

            if (options.ignoredFileExtensions) {
                if (options.ignoredFileExtensions.test(req.path)) {
                    res.status(404).send({error: 'Resource not found'});
                    return; // Do not serve index.html
                }
            }

            // Is it a directory? If so, search for an index.html in it.
            if (stats.isDirectory()) {
                filePath = path.join(filePath, 'index.html');
            }

            // Serve the file
            res.sendFile(path.resolve(filePath), function (err) {
                if (err) {
                    next();
                    return;
                }
            });
        });
    };
}
