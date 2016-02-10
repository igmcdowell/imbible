/* browserify task
   ---------------
   Bundle javascripty things with browserify!
   This task is set up to generate multiple separate bundles, from
   different sources, and to use Watchify when run from the default task.
   See browserify.bundleConfigs in gulp/config.js
*/

var browserify   = require('browserify')
var watchify     = require('watchify')
var mergeStream  = require('merge-stream')
var bundleLogger = require('../util/bundleLogger')
var gulp         = require('gulp')
var babelify     = require('babelify')
var buffer = require('gulp-buffer')
var rev = require('gulp-rev')
var del = require('del')
var handleErrors = require('../util/handleErrors')
var source       = require('vinyl-source-stream')
var configs      = require('../config')
var bundleConfig = configs.browserify
var libsConfig    = configs.libs
var babelifyConfig = configs.babelify

var browserifyTask = function(callback, devMode) {  
  var b = browserify(bundleConfig)
  
  var bundle = function() {
    del(bundleConfig.dest + '/js/bundle*')
    // Log when bundling starts
    bundleLogger.start(bundleConfig.outputName)    
    return b
      .external(libsConfig.srcs)
      .bundle()
      // Report compile errors
      .on('error', handleErrors)
      // Use vinyl-source-stream to make the
      // stream gulp compatible. Specify the
      // desired output filename here.
      .pipe(source(bundleConfig.outputName))
      // Specify the output destination
      .pipe(buffer())
      .pipe(rev())
      .pipe(gulp.dest(bundleConfig.dest))
      .pipe(rev.manifest(bundleConfig.dest + '/manifest.json', {
        base: bundleConfig.dest
        , merge: true
      }))
      .pipe(gulp.dest(bundleConfig.dest))
  }

  if(devMode) {
    // Wrap with watchify and rebundle on changes
    b = watchify(b)
    // Rebundle on update
    b.on('update', bundle)
    b.on('time', function(){bundleLogger.end(bundleConfig.outputName)})
    bundleLogger.watch(bundleConfig.outputName)
  }

  // Transform must happen outside of the bundle function. Otherwise
  // Watchify will cause it to be applied multiple times
  b.transform(babelify.configure(babelifyConfig))

  return bundle()
}

gulp.task('browserify', browserifyTask)

// Exporting the task so we can call it directly in our watch task, with the 'devMode' option
module.exports = browserifyTask
