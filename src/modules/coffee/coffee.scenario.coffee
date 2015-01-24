describe 'coffee', ->
  page = null
  beforeEach () ->
    page = new CoffeePage()
    page.get()

  it 'should have a h1', ->
    expect(page.heading.getText()).toContain 'CoffeeScript'

  it 'should initially have clickCount=0', ->
    expect(page.getClickCountText()).toBe '0'

  it 'should increment clickCount when button is clicked', ->
    page.clickCountButton()
    expect(page.getClickCountText()).toBe '1'
    page.clickCountButton().clickCountButton()
    expect(page.getClickCountText()).toBe '3'


# This is an example using the Page Pattern for Protractor testing as described by:
# https://github.com/angular/protractor/blob/master/docs/page-objects.md
# and
# http://product.moveline.com/testing-angular-apps-end-to-end-with-protractor.html
# For more complex sets of pages/interactions, you may wish to refactor these
# out into separate files/folders and require() them into your scenario.
class CoffeePage
  constructor: ->
    @heading = element By.css 'h1'
    @clickCount = element By.binding 'clickCount'
    @clickCountBtn = element By.css '.btn'

  get: ->
    browser.get '/#!/coffee'
    browser.waitForAngular()
    browser.getCurrentUrl()

  clickCountButton: ->
    @clickCountBtn.click()
    @

  getClickCountText: ->
    @clickCount.getText()
