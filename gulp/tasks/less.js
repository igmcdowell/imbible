var less = require('gulp-less');
var rev = require('gulp-rev');
var path = require('path');
var config  = require('../config').less
var gulp     = require('gulp')
var autoprefixer = require('gulp-autoprefixer');
var del = require('del')

gulp.task('less', function () {
  del([config.dest + '/style/addons*'])
  return gulp.src(config.src, {base: path.join(process.cwd(), 'src')})
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(rev())
    .pipe(gulp.dest(config.dest))
    .pipe(rev.manifest(config.dest + '/manifest.json', {
      base: config.dest
      , merge: true
    }))
    .pipe(gulp.dest(config.dest))
    ;
});
