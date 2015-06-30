'use strict';

/**
 * @ngdoc service
 * @name documenter2App.gapi
 * @description
 * # gapi
 * Factory in the documenter2App.
 */
angular.module('documenter2App')
  .factory('gapi', ['$timeout', function ($timeout) {

    var factory = {};
    var CLIENT_ID = '91499618649-eck6cp62rvfhu6hc7gujvain7mvmnjlq.apps.googleusercontent.com';
    var SCOPES = [
      'https://www.googleapis.com/auth/drive'
    ];

    factory.authorize = function(auth) {

      $timeout(function() {
        gapi.auth.authorize({
          'client_id': CLIENT_ID,
          'scope': SCOPES,
          'immediate': true
        }, handleAuthResult);
      }, 1500);

      var handleAuthResult = function(authResult) {
        if (authResult) {
          auth.done(authResult);
          // Access token has been successfully retrieved, requests can be sent to the API
        } else {
          // No access token could be retrieved, force the authorization flow.
          gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
            handleAuthResult);
        }
      }

    };

    factory.listFolder = function(options) {

      if (typeof options.id == "undefined") {
        options.id = 'root';
      }

      var request = gapi.client.request({
        'path': '/drive/v2/files',
        'method': 'GET',
        'params': {
          'maxResults': '200',
          'q': "'"+options.id+"' in parents and trashed = false"
        }
      });

      request.execute(function(resp) {
        options.done(resp);
      });

    };

    factory.getUser = function(options) {

      if (typeof options.id == "undefined") {
        options.id = 'root';
      }

      var request = gapi.client.request({
        'path': '/drive/v2/about',
        'method': 'GET'
      });

      request.execute(function(resp) {
        options.done(resp);
      });

    };

    factory.printFile = function(options) {
      var request = gapi.client.request({
        'path': '/drive/v2/files/'+options.id,
        'method': 'GET'
      });
      request.execute(function(resp) {
        options.done(resp);
      });
    }

    factory.downloadFile = function(file, callback) {
      if (file.downloadUrl) {
        var accessToken = gapi.auth.getToken().access_token;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', file.downloadUrl);
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        xhr.onload = function() {
          callback(xhr.responseText);
        };
        xhr.onerror = function() {
          callback(null);
        };
        xhr.send();
      } else {
        callback(null);
      }
    }

    return factory;

  }]);
