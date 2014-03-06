/* globals describe, it */
'use strict';

var chai   = require('chai');
var mgmt   = require('../src/mgmt');
var assert = chai.assert;

describe('mgmt', function () {
    describe('getLogs', function () {
        it('should return a parsed array of commit logs', function (ok) {
            mgmt.getLogs()
                .then(function (logs) {
                    var log = logs[1];
                    assert.ok(logs.length);
                    assert.ok('author' in log);
                    assert.ok('message' in log);
                    assert.ok('description' in log);
                    assert.ok(logs[0].date instanceof Date);
                    ok();
                }, ok);
        });
    });
});
