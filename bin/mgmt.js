#!/usr/bin/env node
'use strict';

var port = 53978;

/******************
 *  Dependencies  *
 ******************/

var program     = require('commander');
var gulp        = require('gulp');
var openBrowser = require('gulp-open');
var exec        = require('child_process').exec;

/***************
 *  Arguments  *
 ***************/

var args = process.argv.slice(2);

program
  .version('0.0.0')
  // .option('-p, --peppers', 'Add peppers')
  // .option('-P, --pineapple', 'Add pineapple')
  // .option('-b, --bbq', 'Add bbq sauce')
  // .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .parse(process.argv);

/**********
 *  Main  *
 **********/

// Just run the management tool
if (args.length === 0) {
    var options = { url : 'http://localhost:' + port };

    require('../server/server');

    gulp.src('./app/index.html')
        .pipe(openBrowser('', options));

    console.log('Running mgmt... Control-C to quit');
}
