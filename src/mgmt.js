'use strict';

var mgmt;

/******************
 *  Dependencies  *
 ******************/

var Promise = require('promise');
var exec    = Promise.denodeify(require('child_process').exec);

/***************
 *  Constants  *
 ***************/

var delimiter = '\t';

var fields = ['author', 'date', 'message', 'description'];

var placeHolders = {
    author      : '%an',
    date        : '%ct',
    message     : '%s',
    description : '%b'
};

/*************
 *  Methods  *
 *************/

/**
 * Formats an appropriate log command
 */
function getLogCommand() {
    var command = 'git log --pretty="';
    var format = [];

    fields.forEach(function (key) {
        format.push(placeHolders[key]);
    });

    return command + format.join(delimiter) + '"';
}

/**
 * Parses commit logs and returns an array of commit objects
 * @param {String} stdin Commit logs as an unparsed string
 */
function parseLogs(stdin) {
    var logs = stdin.split('\n');

    logs.forEach(function (log, i) {
        var items = log.split(delimiter);
        var result = {};

        fields.forEach(function (key, j) {
            result[key] = items[j];
        });

        // Convert date seconds to ms
        result.date = result.date ? new Date(result.date * 1000) : null;

        logs[i] = result;
    });

    return logs;
}

/**
 * Returns a parsed collection of logs associated with the project
 * @return {Promise} A promise with the parsed commit logs
 */
function getLogs() {
    return exec(getLogCommand())
            .then(function (stdin) {
                return parseLogs(stdin);
            });
}

/*********
 *  API  *
 *********/

mgmt = {
    getLogs : getLogs
};

/*************
 *  Exports  *
 *************/

module.exports = mgmt;
