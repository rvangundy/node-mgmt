'use strict';

/******************
 *  Dependencies  *
 ******************/

var rest           = require('rest-browser-client');
var commitTemplate = require('../templates/commits.hbs');
var queryString    = require('query-string');
var Handlebars     = require('hbsfy/runtime');

/********************
 *  Static Private  *
 ********************/

/**
 * The full set of commit logs
 * @type {Object}
 */
var logs = null;

/****************
 *  Formatting  *
 ****************/

/**
 * Converts a time duration to a natural language string specifying
 * the time that has passed in minutes, hours, days, months, or years.
 * @param {Number} time The time of the event of interest in ms
 */
function formatTimeSince(time) {
    var duration = Date.now() - time;
    var minutes  = duration / 60000;
    var hours    = minutes / 60;
    var days     = hours / 24;
    var years    = days / 365;

    if (years >= 1) { return Math.round(years) + ' years ago'; }
    if (days >= 1) { return Math.round(days) + ' days ago'; }
    if (hours >= 1) { return Math.round(hours) + ' hours ago'; }

    return Math.round(minutes) + ' minutes ago';
}

// Establish a handlebars helper for formatting the date
Handlebars.registerHelper('timesince', function (context) {
    return formatTimeSince(context);
});

/*************
 *  Queries  *
 *************/

/**
 * Filters out all commit logs by hashtag
 * @param {Array} commits An array of all commit logs
 * @param {String} hash The hash tag to filter
 */
function filterByHashtag(commits, hash) {
    var logs = [];

    commits.forEach(function (log) {
        if (log.tags && log.tags.hash && log.tags.hash.indexOf(hash) >= 0) {
            logs.push(log);
        }
    });

    return logs;
}

/**
 * Filters out all commit logs by author
 * @param {Array} commits An array of all commit logs
 * @param {String} author The author to filter
 */
function filterByAuthor(commits, author) {
    var logs = [];

    commits.forEach(function (log) {
        if (log.author && log.author === decodeURIComponent(author)) {
            logs.push(log);
        }
    });

    return logs;
}

/**
 * Executes the URL query string and returns the filtered logs
 * @return {Array} Filtered logs
 */
function execQuery() {
    var query  = queryString.parse(location.search);
    var author = query.author;
    var hash   = query.hash;

    if (hash) { return filterByHashtag(logs, hash); }
    if (author) { return filterByAuthor(logs, author); }

    return logs;
}

/*********
 *  API  *
 *********/

/**
 * The client-side API
 * @type {Client}
 */
var client = rest('./logs');

/**
 * Retrieves and displays the commit logs
 */
function getCommitLogs() {
    client.use(rest.json());
    client.get(function (req, res) {
        logs = res.body;
        console.log(logs);
        document.body.innerHTML = commitTemplate(execQuery());
    });
}

/**************
 *  App Init  *
 **************/

window.addEventListener('load', getCommitLogs, false);
