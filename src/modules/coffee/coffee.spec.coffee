describe 'CoffeeController', ->

  beforeEach module 'app.coffee'

  beforeEach(inject ($rootScope, $controller) ->
    scope = $rootScope.$new()
    ctrl = $controller 'CoffeeController',
      $scope : scope
  )

  it 'should have CoffeeController defined', ->
    expect(ctrl).toBeDefined()

  describe 'its scope', ->
    it 'should have clickCount start at 0', ->
      expect(scope.clickCount).toEqual 0

    it 'should increment clickCount when addClick() is called', ->
      scope.addClick()
      expect(scope.clickCount).toEqual 1
