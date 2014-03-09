'use strict';

/******************
 *  Dependencies  *
 ******************/

var mgmt = require('../src/mgmt');
var express = require('express');

/***************
 *  Constants  *
 ***************/

var API_PATH = '/logs';

/************
 *  Server  *
 ************/

/**
 * Serves up the API on the given server
 * @param {Application} server An expressjs server application
 */
function serveAPI(server) {
    // Prepare middleware
    server.use(API_PATH, express.json());

    server.get(API_PATH, function (req, res) {
        mgmt.getLogs()
            .then(function (logs) {
                res.send(logs);
            });
    });
}

/*************
 *  Exports  *
 *************/

module.exports = serveAPI;
