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
    'ui.tinymce',
    'ui.sortable',
    'angularFileUpload'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
          templateUrl: 'views/dashboard.html',
          controller: 'DashboardCtrl'
      })
      .when('/load', {
        templateUrl: 'views/load.html',
        controller: 'LoadCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/edit/:id', {
          templateUrl: 'views/editor.html',
          controller: 'EditCtrl'
      })
      .when('/edit/:id/:name', {
          templateUrl: 'views/editor.html',
          controller: 'EditCtrl'
      })
      .when('/error', {
        templateUrl: 'views/error.html',
        controller: 'ErrorCtrl'
      })
      .otherwise({
          redirectTo: '/'
      });
  });
