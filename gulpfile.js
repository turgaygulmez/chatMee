'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');


gulp.task('default', ['browser-sync'], function () {
});

gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:3000",
        files: ["public/**/*.*"],
        port: 7000,
	});
});

gulp.task('nodemon', function () {
	return nodemon({
		// express server file
		script: 'server.js'
	});
});