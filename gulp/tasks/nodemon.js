var config      = require('../config').nodemon
var gulp        = require('gulp')
var nodemon     = require('gulp-nodemon')
var argv        = require('yargs').argv;

gulp.task('nodemon', function(callback, debug) {
  var called = false;
  if(argv.debug){
    config.execMap.es6 = config.execMap.es6 + ' --debug'
  }
  return nodemon(config).on('start', function () {
    if (!called) { 
      called = true;
      callback(); 
    }
  })
});
