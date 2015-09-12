var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var sass = require('gulp-ruby-sass');
var browserSync = require('browser-sync');
var jade = require('gulp-jade');
var mappy = './bower_components/susy/sass/';
var susy = './bower_components/mappy-breakpoints/'; 

gulp.task('jtemplates', function() {
  var YOUR_LOCALS = {};
 
  gulp.src(['./App/*.jade'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
//    .pipe($.cache($.jade({pretty: true, doctype:'html'})))
    .pipe(gulp.dest('./Dist'))

});

//reload files, once jade compilation happens

gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: "./Dist"
    }
  });
//  gulp.watch("/Dist/*.html").on("change", browserSync.reload);
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('images', function(){
  gulp.src('App/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('Dist/images/'));
});

gulp.task('styles', function(){
    gulp.src(['App/scss/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('Dist/css/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('sass', function() {
    return sass('App/scss/*.scss', { 
      style: 'expanded',
      loadPath: [susy, mappy]
//      loadPath: ["mappy"],
      })
        // IN case you want to have only ONE css file and you want to concat it too.

        .pipe(concat('style.css'))
        .pipe(gulp.dest('Dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function(){
  return gulp.src('App/js/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('Dist/js/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('Dist/js/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('default', ['browser-sync'], function(){
  gulp.watch("App/scss/*.scss", ['sass']);
  gulp.watch("App/js/*.js", ['scripts']);
  gulp.watch("App/**/*.jade", ['jtemplates']);
  gulp.watch("Dist/*.html", ['bs-reload']);
  
});