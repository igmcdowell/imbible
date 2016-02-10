var gulp = require('gulp')

gulp.task('build-assets', ['less', 'sass', 'browserify', 'common-js'])
gulp.task('build', ['build-assets'], function() {
  gulp.run('rev-replace')
})
