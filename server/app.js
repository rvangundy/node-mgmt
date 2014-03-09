'use strict';

/******************
 *  Dependencies  *
 ******************/

var browserify  = require('browserify');
var hbsfy       = require('hbsfy');
var jsdom       = require('jsdom');
var Promise     = require('promise');
var fs          = require('fs');
var styl        = require('styl');
var reworkNPM   = require('rework-npm');
var reworkMath  = require('rework-math');
var read        = Promise.denodeify(fs.readFile);

/***************
 *  Constants  *
 ***************/

var APP_ROOT = '/';
var SCRIPT_SRC = __dirname + '/../app/index.js';
var HTML_SRC = __dirname + '/../app/index.html';
var STYL_SRC = __dirname + '/../app/main.styl';

/*********
 *  App  *
 *********/

/**
 * Uses browserify to compile the given script file
 * @param {String} src The src of the top-level application script
 */
function compileScript(src, opts) {
    var b = browserify([src]);

    return new Promise(function (resolve, reject) {
        b.transform(hbsfy);
        b.bundle(opts, function (err, src) {
            if (err) { reject(err); }
            else { resolve(src); }
        });
    });
}

/**
 * Loads the DOM from the specified src
 * @param {String} src The source HTML file to load
 */
function loadDOM(src) {
    var domEnv = Promise.denodeify(jsdom.env.bind(jsdom));

    return read(src, 'utf-8')
        .then(domEnv);
}

/**
 * Loads the style and runs it as a pre-compiled styl document
 * @param {String} src The styl document to load
 */
function loadStyle(src) {
    return read(src, 'utf-8')
        .then(function (text) {
            var style = styl(text, {whitespace : true})
                .use(reworkNPM({ dir : __dirname + '/../node_modules' }))
                .use(reworkMath())
                .toString();
            return style;
        });
}

/**
 * Serves the app on the given server
 * @param {Application} server An expressjs application
 */
function serveApp(server, opts) {
    var page;

    Promise.all([
        compileScript(SCRIPT_SRC, opts),
        loadDOM(HTML_SRC),
        loadStyle(STYL_SRC)
    ]).then(function (res) {
        var src      = res[0];
        var window   = res[1];
        var css      = res[2];
        var document = window.document;
        var script   = document.createElement('script');
        var style    = document.createElement('style');
        var head     = document.querySelector('head');

        script.type = 'text/javascript';
        script.appendChild(document.createTextNode(src));
        head.appendChild(script);

        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        head.appendChild(style);

        page = window.document.innerHTML;
    }).catch(function (err) {
        console.log(err);
    });

    // Serve up the given index.html file
    server.get(APP_ROOT, function (req, res) {
        res.send(page);
    });
}

/*************
 *  Exports  *
 *************/

module.exports = serveApp;
