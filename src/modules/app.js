angular.module( 'app', [
  'templates-modules',
  // 'templates-common',
  'app.home',
  'app.coffee',
  'ui.router',
  'ui.bootstrap.tpls',
  'ui.bootstrap'
])

.config( function appConfig ( $stateProvider, $urlRouterProvider, $locationProvider  ) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'home/home.tpl.html',
      data: {
        pageTitle: 'Home'
      }
    })
    .state('coffee', {
      url: '/coffee',
      templateUrl: 'coffee/coffee.tpl.html',
      controller: 'CoffeeController',
      data: {
        pageTitle: 'CoffeeScript'
      }
    });
  $urlRouterProvider.otherwise( '/home' )
  $locationProvider.hashPrefix('!')
})

.run( function run () {
})
