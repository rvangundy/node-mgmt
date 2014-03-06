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
 * @param {String} stdout Commit logs as an unparsed string
 */
function parseLogs(stdout) {
    var logs = stdout.split('\n').reverse();
    var results = [];

    logs.forEach(function (log) {
        var items, result;

        if (log) {
            items = log.split(delimiter);
            result = {};

            fields.forEach(function (key, j) {
                result[key] = items[j];
            });

            // Convert date seconds to ms
            result.date = result.date ? new Date(result.date * 1000) : null;

            results.push(result);
        }
    });

    return results;
}

/**
 * Returns a parsed collection of logs associated with the project
 * @return {Promise} A promise with the parsed commit logs
 */
function getLogs() {
    return exec(getLogCommand())
            .then(function (stdout) {
                return parseLogs(stdout);
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
