/*
 * Externalize all site-wide libraries into one file.  Since these libraries are all sizable, it would be better for the
 * client to request it individually once and then retreive it from the cache
 */
var config = require('../config').libs
var gulp = require('gulp')
var _ = require('lodash')
var babelify = require('babelify')
var browserify = require('browserify')
var source = require('vinyl-source-stream');
var rev = require('gulp-rev')
var buffer = require('gulp-buffer');
var del = require('del')

gulp.task("common-js", function() {
  del(config.dest + '/js/common*')

  return browserify()
  .require(config.srcs)
  .transform(babelify, {presets: ["es2015", "react"]})
  .bundle()
  .pipe(source('js/common.js'))
  .pipe(buffer())
  .pipe(rev())
  .pipe(gulp.dest(config.dest))
  .pipe(rev.manifest(config.dest + '/manifest.json', { 
    base:config.dest 
    , merge: true
  }))
  .pipe(gulp.dest(config.dest));
});
