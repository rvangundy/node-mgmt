'use strict';

/******************
 *  Dependencies  *
 ******************/

var gulp       = require('gulp');
var mocha      = require('gulp-mocha');
var supervisor = require('gulp-supervisor');
var bump       = require('gulp-bump');

/***********
 *  Tasks  *
 ***********/

// Develop
gulp.task('develop', function () {
    supervisor('./server/server.js', {
       // args         : [ 'dev' ],
        watch        : ['server', 'app', 'src', 'templates'],
        ignore       : null,
        pollInterval : 500,
        extensions   : ['js,hbs,styl'],
        exec         : 'node',
        debug        : true,
        debugBrk     : false,
        harmony      : false,
        noRestartOn  : 'error',
        forceWatch   : true,
        quiet        : false
    });
});

// Test
gulp.task('test', function () {
    gulp.src('test/index.js')
        .pipe(mocha());
});

// Bump
gulp.task('bump', function () {
    gulp.src(['./package.json'])
        .pipe(bump({type : 'fix'}))
        .pipe(gulp.dest('./'));
});
