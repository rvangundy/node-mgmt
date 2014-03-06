'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test', function () {
    gulp.src('test/index.js')
        .pipe(mocha());
});
