var gulp         = require('gulp')
var sass         = require('gulp-sass')
var sourcemaps   = require('gulp-sourcemaps')
var handleErrors = require('../util/handleErrors')
var config       = require('../config').sass
var path = require('path')
var rev = require('gulp-rev');
var del = require('del')

gulp.task('sass', function () {
  del([config.dest + '/style/app*'])
  return gulp.src(config.src, {base: path.join(process.cwd(), 'src')})
    .pipe(sourcemaps.init())
    .pipe(sass(config.settings))
    .on('error', handleErrors)
    .pipe(sourcemaps.write())
    .pipe(rev())
    .pipe(gulp.dest(config.dest))
    .pipe(rev.manifest(config.dest + '/manifest.json', {base: config.dest, merge: true}))
    .pipe(gulp.dest(config.dest))
})
