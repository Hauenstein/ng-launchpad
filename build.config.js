module.exports = {
  port: 8000,

  files: {
    js: {

      // Use uncompressed versions of 3rd-pary libraries.
      // They will be compressed in production.
      // Any libraries added to /vendor must be added here.
      // If you remove a library you must remove it here too.
      vendor: [
        'vendor/jquery/dist/jquery.js',
        'vendor/bootstrap/dist/js/bootstrap.js',
        'vendor/angular/angular.js',
        'vendor/angular-mocks/angular-mocks.js',
        'vendor/angular-ui-router/release/angular-ui-router.js',
        'vendor/angular-bootstrap/ui-bootstrap-tpls.js'
      ],

      app: [
        'src/{common,modules}/**/*.js',
        'src/{common,modules}/**/*.coffee',
        '!src/{common,modules}/**/*.spec.*',
        '!src/{common,modules}/**/*.scenario.*'
      ],

      buildDest: 'build/js'
    },

    less: {
      main: [
        'src/less/main.less',
        'src/common/**/*.less',
        'src/modules/**/*.less'
      ],

      buildDest: 'build/css'
    },

    jade: {
      index: 'src/index.jade',

      tpls: {
        modules: 'src/modules/**/*.tpl.jade',

        common: 'src/common/**/*.tpl.jade'
      },

      buildDest: 'build'
    },

    img: {
      src: 'src/img/**/*',

      buildDest: 'build/img'
    },

    test: {
      e2e: 'src/**/*.scenario.{js,coffee}',

      unit: [
        'build/js/vendor.js',
        'build/js/templates-*.js',
        'build/js/app.js',
        'src/**/*.spec.{js,coffee}'
      ]
    }
  }
}
