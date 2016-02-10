/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
*/

var gulp     = require('gulp')
var watch = require('gulp-watch')
var config   = require('../config')

gulp.task('watch', ['watchify'], function(callback) {
  gulp.watch(config.sass.watch, function() {
    gulp.run('sass')
  })
  gulp.watch(config.less.watch, function(){
    gulp.run('less') 
  })
  watch(config.revReplace.watch, {events: ['add', 'change']}, function() {
    gulp.run('rev-replace')
  })
  // Watchify will watch and recompile our JS, so no need to gulp.watch it
})
