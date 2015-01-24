'use strict'

describe('app', function () {
  beforeEach(function() {
    browser.get('/');
  });

  it('should redirect to /home', function () {
    expect(browser.getLocationAbsUrl()).toMatch('/home');
  });
})
