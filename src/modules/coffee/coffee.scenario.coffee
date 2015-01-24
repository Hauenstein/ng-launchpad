describe 'coffee', ->
  beforeEach () -> browser.get '#!/coffee'

  it 'should have a h1', ->
    expect element(By.css 'h1').getText()
      .toContain 'CoffeeScript'

  it 'should initially have clickCount=0', ->
    expect element(By.binding 'clickCount').getText()
      .toBe '0'

  it 'should increment clickCount when button is clicked', ->
    element(By.css '.btn').click()
    expect element(By.binding 'clickCount').getText()
      .toBe '1'
    element(By.css '.btn').click()
    expect element(By.binding 'clickCount').getText()
      .toBe '2'
