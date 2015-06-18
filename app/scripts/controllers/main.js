'use strict';

/**
 * @ngdoc function
 * @name documenter2App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the documenter2App
 */
angular.module('documenter2App')
  .controller('MainCtrl', function ($scope) {
        $scope.tinymceOptions = {
            setup: function (ed) {
                ed.on("change", function () {
                    console.log('hei');
                })
            },
            inline: false,
            plugins : 'advlist autolink link image lists charmap print preview',
            skin: 'lightgray',
            theme : 'modern'
        };

        $scope.navs = [
            {title: 'test1'},
            {title: 'test2'},
            {title: 'test3'}
        ]
  });
