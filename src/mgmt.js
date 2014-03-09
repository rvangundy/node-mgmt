'use strict';

var mgmt;

/******************
 *  Dependencies  *
 ******************/

var Promise = require('promise');
var exec    = Promise.denodeify(require('child_process').exec);

/************
 *  RegExp  *
 ************/

/**
 * Queries for identifiers of either hashtags or IDs
 * @type {RegExp}
 */
var queryTags = /#(\w+)|@(\w+)/g;

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
 * Parses out tags, strings of letters and numbers beginning
 * with @ or #.
 * @param {String} text A string containing identifiers
 * @param {Object} tags An optional tags object to return
 * @return {Object} tags
 */
function parseTags(text, tags) {
    var result;

    tags = tags || {
        hash : [],
        ids : []
    };

    if (!text) { return tags; }

    // Collect all tags using a regular expression
    while ((result = queryTags.exec(text)) !== null) {
        if (result[1]) { tags.hash.push(result[1]); }
        if (result[2]) { tags.ids.push(result[2]); }
    }

    return tags;
}

/**
 * Formats an appropriate log command
 */
function getLogCommand() {
    var command = 'git log --pretty="';
    var format  = [];

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
    var logs = stdout.split('\n');
    var results = [];

    logs.forEach(function (log) {
        var items, result, tags;

        if (log) {
            items = log.split(delimiter);
            result = {};

            fields.forEach(function (key, j) {
                result[key] = items[j];
            });

            // Convert date seconds to ms
            result.date = result.date ? result.date * 1000 : null;

            // Get all @ and # tags
            tags = parseTags(result.message, tags);
            tags = parseTags(result.description, tags);

            if (tags) { result.tags = tags; }

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
            }.bind(this));
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
