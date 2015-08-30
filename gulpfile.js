var del = require('del');
var lazypipe = require('lazypipe');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

// globally handle all missed error events
var gulp_src = gulp.src;
gulp.src = function() {
    return gulp_src.apply(gulp, arguments).pipe($.plumber(function(error) {
        $.util.log($.util.colors.red('Error (' + error.plugin + '): ' + error.message), $.util.colors.red(error.stack));
        this.emit('end');
    }));
};

gulp.task('clean', function() {
    del(['dist/*', 'reports', 'debug', '.coverdata', '.coverrun']);
});

gulp.task('browserify', function() {
    return browserify({entries: ['./src/epub-maker.js']}).bundle()
        .pipe(source('epub-maker-browserified.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./debug/'));
});

gulp.task('analyse', function() {
    gulp.src(['./src/epub-maker.js'])
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('build', ['clean', 'analyse', 'browserify'], function() {
    return gulp.src(['debug/**/*.js'])
        .pipe($.concat("epub-maker.js"))
        .pipe($.size('test'))
        .pipe(gulp.dest('dist'));
});

gulp.task('dist', ['build'], function() {
    return gulp.src(['debug/**/*.js'])
        .pipe($.uglify())
        .pipe($.concat("epub-maker.min.js"))
        .pipe($.size())
        .pipe(gulp.dest('dist'));
});

var testAndGather = lazypipe()
    .pipe($.coverage.instrument, { pattern: ['dist/epub-maker.js'], debugDirectory: 'debug' })
    .pipe($.jasmine, { includeStackTrace: true })
    .pipe($.coverage.gather);

gulp.task('test', ['build'], function() {
    gulp.src(['spec/**/*spec.js'])
        .pipe(testAndGather())
        .pipe($.coverage.format(['html']))
        .pipe(gulp.dest('reports/coverage'));
});

gulp.task('travis', ['build'], function() {
    gulp.src('spec/**/*spec.js')
        .pipe(testAndGather())
        .pipe($.coverage.format(['lcov']))
        //.pipe($.coveralls());
});

gulp.task('report', ['clean', 'test'], function() {
    $.util.log($.util.colors.green('reports will be generated in ./reports'));
});
gulp.task('default', ['report'], function() {});