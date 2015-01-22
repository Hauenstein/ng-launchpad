var gulp = require('gulp'),
  del = require('del'),
  jshint = require('gulp-jshint'),
  coffee = require('gulp-coffee'),
  coffeelint = require('gulp-coffeelint'),
  eventStream = require('event-stream'),
  filter = require('gulp-filter'),
  less = require('gulp-less'),
  minifyCSS = require('gulp-minify-css'),
  html2js = require('gulp-html2js'),
  concat = require('gulp-concat'),
  jade = require('gulp-jade'),
  ngAnnotate = require('gulp-ng-annotate'),
  uglify = require('gulp-uglify'),
  htmlmin = require('gulp-htmlmin'),
  imagemin = require('gulp-imagemin'),
  cache = require('gulp-cache'),
  livereload = require('gulp-livereload'),
  wrap = require('gulp-wrap'),
  karma = require('gulp-karma'),
  protractor = require('gulp-protractor').protractor,
  webdriverStandalone = require('gulp-protractor').webdriver_standalone,
  webdriverUpdate = require('gulp-protractor').webdriver_update,
  runSequence = require('run-sequence'),
  files = require('./build.config.js').files,
  connect = require('connect'),
  http = require('http');

var productionDir = '_public', // production output directory (default: _public)
  port = require('./build.config.js').port,
  server = { close: function(cb) { cb(); } };



// Concatenate vendor JS into vendor.js.
gulp.task('js:vendor', function () {
  return gulp.src(files.js.vendor)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(files.js.buildDest));
});

// Process app's js/coffeescript into app.js.
gulp.task('js:app', function () {
  // Stream js and cs files through their linters/compilers:
  var js = gulp.src(files.js.app)
    .pipe(filter('**/*.js'))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
  var cs = gulp.src(files.js.app)
    .pipe(filter('**/*.coffee'))
    .pipe(coffeelint())
    .pipe(coffeelint.reporter())
    .pipe(coffee({bare: true}));

  // Merge the results and stream into app.js:
  return eventStream.merge(js, cs)
    .pipe(ngAnnotate())
    .pipe(concat('app.js'))
    .pipe(wrap('(function ( window, angular, undefined ) {\n' +
      '\'use strict\';\n' +
      '<%= contents %>' +
      '})( window, window.angular );'))
    .pipe(gulp.dest(files.js.buildDest));
});

// Cache src/modules templates into templates-modules.js.
gulpJSTemplates('modules');

// Cache src/common templates into templates-common.js.
gulpJSTemplates('common');

// Process Less files into main.css.
gulp.task('css', function () {
  return gulp.src(files.less.main)
    .pipe(concat('main.less'))
    .pipe(less())
    .pipe(gulp.dest(files.less.buildDest));
});

// Convert index.jade into index.html.
gulp.task('html', function () {
  return gulp.src(files.jade.index)
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest(files.jade.buildDest));
});

// Process images.
gulp.task('img', function () {
  return gulp.src(files.img.src)
    .pipe(cache(imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true})))
    .pipe(gulp.dest(files.img.buildDest));
})

// Compile CSS for production.
gulp.task('compile:css', function () {
  return gulp.src('build/**/*.css')
    .pipe(minifyCSS({keepSpecialComments: 0}))
    .pipe(gulp.dest(productionDir));
});

// Compile JS for production.
gulp.task('compile:js', function () {
  return gulp.src('build/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(productionDir));
});

// Compile HTML for production.
gulp.task('compile:html', function () {
  return gulp.src('build/**/*.htm*')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(productionDir));
});

// Prepare images for production.
gulp.task('compile:img', function () {
  return gulp.src('build/img/**')
    .pipe(gulp.dest(productionDir+'/img'));
});

// Update/install webdriver.
gulp.task('webdriver:update', webdriverUpdate);

// Run webdriver standalone server indefinitely.
// Usually not required.
gulp.task('webdriver:standalone', ['webdriver:update'], webdriverStandalone);

// Run unit tests using karma.
gulp.task('karma', ['build'], function () {
  return gulp.src(files.test.unit)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(e) {throw e});
});

// Run unit tests using karma and watch for changes.
gulp.task('karma:watch', ['watch:files'], function () {
  return gulp.src(files.test.unit)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'watch'
    }))
    .on('error', function(e) {throw e});
});

// Run e2e tests using protractor.
gulp.task('protractor', ['protractor:init'], function(callback) {
  runSequence('protractor:run', 'protractor:close', callback);
});

gulp.task('protractor:init', ['webdriver:update', 'server']);
gulp.task('protractor:close', ['server:close']);
gulp.task('protractor:run', function() {
  return gulp.src(files.test.e2e)
    .pipe(protractor({
        configFile: 'protractor.conf.js',
    }))
    .on('error', function(e) {throw e});
});

// Run e2e tests using protractor and watch for changes.
gulp.task('protractor:watch', ['protractor:init', 'watch:files'], function () {
  runSequence('protractor:run');
  gulp.watch(['build/**/*', files.test.e2e], ['protractor:run']);
});

// One-time run through unit/e2e tests
gulp.task('test', ['karma', 'protractor']);

// Clean build directory.
gulpClean('build');

// Clean production directory.
gulpClean(productionDir);

// Clean build and production directories.
gulp.task('clean', function (callback) {
  runSequence(
    ['clean:build', 'clean:'+productionDir],
    callback
    );
});

// Build files for local development.
gulp.task('build', function (callback) {
  runSequence(
    'clean:build',
    [
      'js:vendor',
      'js:app',
      'js:templates-common',
      'js:templates-modules',
      'css',
      'html',
      'img'
    ],
    callback);
});

// Process files and put into directory ready for production.
gulp.task('compile', function (callback) {
  runSequence(
    ['build', 'clean:'+productionDir],
    [
      'compile:js',
      'compile:css',
      'compile:html',
      'compile:img'
    ],
    callback);
});

// Run server.
gulp.task('server', ['build'], function (next) {
  var app = connect();
  server = http.createServer(app);
  app.use(connect.static('build'));
  server.listen(port, next);
});

// Close the server, ex: when one-time tests complete.
gulp.task('server:close', function(callback) {
  server.close(callback);
});

// Watch task
gulp.task('watch:files', ['server'], function () {
  gulp.watch('build.config.js', ['js:vendor']);

  gulp.watch(files.js.app, ['js:app']);

  gulp.watch(files.jade.tpls.modules, ['js:templates-modules']);

  gulp.watch(files.jade.tpls.common, ['js:templates-common']);

  gulp.watch([
        'src/less/**/*.less',
        'src/common/**/*.less',
        'src/modules/**/*.less'
      ], ['css']);

  gulp.watch(files.jade.index, ['html']);

  gulp.watch(files.img.src, ['img']);

  // Livereload
  var lr = livereload();
  gulp.watch('build/**/*', function (event) {
    lr.changed(event.path);
  });
});

// Run unit & e2e tests and watch for changes.
gulp.task('watch:test', ['karma:watch', 'protractor:watch']);

// Build, run server, run unit & e2e tests and watch for changes.
gulp.task('watch', ['watch:files', 'watch:test']);

// Same as watch:files.
gulp.task('default', ['watch:files']);


/**
 * Generate tasks for Angular JS template caching
 *
 * @param {string} folder
 * @return stream
 */
function gulpJSTemplates (folder) {
  gulp.task('js:templates-'+folder, function () {
    return gulp.src(files.jade.tpls[folder])
      .pipe(jade({pretty: true}))
      .pipe(html2js({
        outputModuleName: 'templates-'+folder,
        useStrict: true,
        base: 'src/'+folder
      }))
      .pipe(concat('templates-'+folder+'.js'))
      .pipe(gulp.dest(files.js.buildDest));
  });
}

/**
 * Generate cleaning tasks.
 *
 * @param {string} folder
 * @return stream
 */
function gulpClean (folder) {
  gulp.task('clean:'+folder, function (callback) {
    del([folder], callback);
  });
}
