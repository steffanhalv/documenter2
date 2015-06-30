'use strict';

describe('Service: gapi', function () {

  // load the service's module
  beforeEach(module('documenter2App'));

  // instantiate service
  var gapi;
  beforeEach(inject(function (_gapi_) {
    gapi = _gapi_;
  }));

  it('should do something', function () {
    expect(!!gapi).toBe(true);
  });

});
