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
    var CLIENT_ID = '46862889673-ctj8t599btm46r3criotpd5oibova9pl.apps.googleusercontent.com';
    var SCOPES = [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.appfolder'
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

            if (authResult.error_subtype === 'access_denied') {
                gapi.auth.authorize(
                    {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
                    handleAuthResult);
            } else {
                auth.done(authResult);
            }

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

      //appfolder

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
    };

    factory.downloadFile = function(url, callback) {
      if (url) {
        var accessToken = gapi.auth.getToken().access_token;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
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
    };

    factory.insertFile = function(filename, folder, content, callback) {
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        var contentType = 'application/octet-stream';
        var metadata = {
            'title': filename,
            'mimeType': contentType,
            'parents': [{'id': folder}] //appfolder
        };

        var multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + contentType + '\r\n' + '\r\n' +
            content +
            close_delim;

        var request = gapi.client.request({
            'path': '/upload/drive/v2/files',
            'method': 'POST',
            'params': {'uploadType': 'multipart'},
            'headers': {
                'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody});
        if (!callback) {
            callback = function(file) {
                console.log(file)
            };
        }
        request.execute(callback);
    };

    factory.updateFile = function(fileId, fileMetadata, content, callback) {
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        var contentType = 'application/octet-stream';
        var multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(fileMetadata) +
            delimiter +
            'Content-Type: ' + contentType + '\r\n' + '\r\n' +
            content +
            close_delim;

        var request = gapi.client.request({
            'path': '/upload/drive/v2/files/' + fileId,
            'method': 'PUT',
            'params': {'uploadType': 'multipart', 'alt': 'json'},
            'headers': {
                'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody});
        if (!callback) {
            callback = function(file) {
                console.log(file)
            };
        }
        request.execute(callback);
    };

    return factory;

  }]);
