var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    haml = require('gulp-ruby-haml'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    inject = require("gulp-inject"),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect'),
    autoprefixer = require('gulp-autoprefixer'),
    watch = require('gulp-watch');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('scss/compiled.scss')
        .pipe(sass())
        .pipe(gulp.dest('site/css'));
});

gulp.task('autoprefix', function () {
    return gulp.src('site/compiled.scss')
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('site/css'));
});


// Watch for changes in Haml files
gulp.task('haml-watch', function() {
  gulp.src('haml/*.haml', {read: false}).
       pipe(watch()).
       pipe(haml()).
       pipe(gulp.dest('site'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(concat('all.js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('site/js'));
});

// run a localhost web server
gulp.task('connect', function() {
  connect.server({
    root: 'site',
    port: 9999,
    livereload: true

  });
});

gulp.task('html', function () {
  gulp.src('site.html')
    .pipe(connect.reload());
});

gulp.task('default', ['connect']);

//inject css and js files into the html
gulp.src('site/index.html')
  .pipe(inject(gulp.src(["site/*.js", "site/css/*.css"], {read: false}))) // Not necessary to read the files (will speed up things), we're only after their paths
  .pipe(gulp.dest("dist"));

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
    gulp.watch('scss/*.scss', ['sass']);
    gulp.watch('haml/*.haml', ['haml-watch']);
});

// Default Task
gulp.task('default', ['lint', 'sass', 'haml-watch', 'autoprefix', 'scripts', 'watch', 'connect']);