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
    $rootScope.loggedin = false;
    $location.path('/load');

    $rootScope.goto = function(path) {
      $location.path(path);
    };

    gapi.authorize({
      done: function(resp) {

        $rootScope.loggedin = true;

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

        if ($rootScope.redirectPath==='/load') {
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
          scrollTop: $(div).offset().top-100
        });
      }, 100);
    };

    $scope.scrollToPath = function(path, div) {
      $location.path(path);
      $timeout(function() {
        $('html,body').animate({
          scrollTop: $(div).offset().top-100
        });
      }, 100);
    };

    $rootScope.login = function() {
      gapi.authorize({
        done: function(resp) {

          $rootScope.loggedin = true;

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

          if ($rootScope.redirectPath==='/load'||typeof $rootScope.redirectPath==='undefined') {
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

    //Export functions:

    $rootScope.toggleMenu = function() {
      $('.nav-mobile').toggleClass('active');
    };

    $(window).scroll(function() {
      var windscroll = $(window).scrollTop();
      if (windscroll >= 300 && $('.container').height()>$('.nav-large').height()) {
        $('.nav-large').addClass('fixed');
        $('.container').addClass('right');
      } else {

        $('.nav-large').removeClass('fixed');
        $('.container').removeClass('right');

      }

    }).scroll();

  });
