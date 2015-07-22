'use strict';

/**
 * @ngdoc function
 * @name documenter2App.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the documenter2App
 */
angular.module('documenter2App')
  .controller('LoginCtrl', function ($scope, $rootScope, gapi) {

    $scope.login = function() {
      gapi.authorize({
        done: function(resp) {

          //AFTER AUTH
          gapi.getUser({
            done: function(resp) {
              $scope.$apply(function() {
                $rootScope.user = resp;
              });
            }
          });

          gapi.listProjects({
            done: function(resp) {
              $scope.$apply(function() {
                $rootScope.projects = resp.items;
              });
            }
          });

          gapi.listShared({
            done: function(resp) {
              $scope.$apply(function() {
                $rootScope.sharedProjects = resp.items;
              });
            }
          });

          if ($rootScope.redirectPath==='/login'||$rootScope.redirectPath==='/load') {
            $location.path('/dashboard');
          } else {
            $location.path($rootScope.redirectPath);
          }

        },
        error: function(resp) {
          $location.path('/error');
        }
      }, false);
    };

  });
