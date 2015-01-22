angular.module('app.coffee', [])
.controller 'CoffeeController', ($scope) ->
  $scope.clickCount = 0

  $scope.addClick = ->
    $scope.clickCount += 1
