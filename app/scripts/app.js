'use strict';

/**
 * @ngdoc overview
 * @name documenter2App
 * @description
 * # documenter2App
 *
 * Main module of the application.
 */
angular
  .module('documenter2App', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.tinymce'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'EditCtrl'
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
