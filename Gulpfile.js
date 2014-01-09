var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('jshint', function() {
    gulp.src(['./bin/downstagram', './lib/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter());
});

gulp.task('default', function() {
    gulp.run('jshint');
});
