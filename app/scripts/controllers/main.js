'use strict';

/**
 * @ngdoc function
 * @name documenter2App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the documenter2App
 */
angular.module('documenter2App')
  .controller('MainCtrl', function ($rootScope, $scope, $timeout, $location, gapi) {

    $scope.user = {};
    $rootScope.redirectPath = $location.path();
    $location.path('/load');

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
        $scope.$apply(function() {
          $location.path('/login');
        });
      }
    });

    $scope.scrollToDiv = function(page, div) {
      $scope.currentPage = page;
      $timeout(function() {
        $('html,body').animate({
          scrollTop: $(div).offset().top
        });
      }, 100);

    };

  });
