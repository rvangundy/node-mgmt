'use strict';

var mgmt;

/******************
 *  Dependencies  *
 ******************/

var Promise = require('promise');
var exec    = Promise.denodeify(require('child_process').exec);

/*************
 *  Methods  *
 *************/

/**
 * Returns a parsed collection of logs associated with the project
 */
function getLogs() {

    exec('git logs', function (stdin, err) {

    });

    return deferred.promise;
}

/*********
 *  API  *
 *********/

mgmt = {

};

/*************
 *  Exports  *
 *************/

module.exports = mgmt;
