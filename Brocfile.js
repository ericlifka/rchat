var pickFiles = require('broccoli-static-compiler');
var babelTranspiler = require('broccoli-babel-transpiler');
var fastBrowserify = require('broccoli-fast-browserify');
var concat = require('broccoli-concat');
var mergeTrees = require('broccoli-merge-trees');
var compileLess = require('broccoli-less-single');

var srcTree = pickFiles('app/src', {
    files: ['**/*.js'],
    srcDir: '.',
    destDir: './src'
});

var babelTree = babelTranspiler(srcTree, {
    sourceMap: 'inline'
});

var browserifyTree = fastBrowserify(babelTree, {
    bundles: {
        'app.js': {
            entryPoints: ['./src/app.js']
        }
    },
    browserify: {
        debug: true
    }
});

var vendorTree = pickFiles('bower_components', {
    srcDir: '.',
    destDir: '.',
    files: [
        'lodash/lodash.js',
        'react/react.js',
        'jquery/dist/jquery.js',
        'jquery.cookie/jquery.cookie.js'
    ]
});

var concatenatedVendor = concat(vendorTree, {
    inputFiles: [
        '**/jquery.js',
        '**/*.js'
    ],
    outputFile: '/vendor.js',
    separator: '\n;\n',
    wrapInEval: false,
    wrapInFunction: false
});

var html = pickFiles('app', {
    srcDir: '/',
    destDir: '/',
    files: ['index.html']
});

var styles = compileLess(['app/styles'], 'app.less', 'app.css', {});
var finalTree = mergeTrees([html, styles, browserifyTree, concatenatedVendor]);

module.exports = finalTree;
