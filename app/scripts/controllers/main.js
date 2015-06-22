'use strict';

/**
 * @ngdoc function
 * @name documenter2App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the documenter2App
 */
angular.module('documenter2App')
  .controller('MainCtrl', function ($scope, $timeout) {
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

        $scope.pages = [
            {
              title: 'Page',
              sections: [{
                title: 'Section',
                id: 'section_0'
              }]
            }
        ];

        $scope.currentPage = $scope.pages[0];
        $scope.switchPage = function(page) {
          $scope.currentPage = page;
        };

        $scope.addPage = function() {
          $scope.pages.push(
            {
              title: 'Page',
              sections: [{
                title: 'Section',
                id: 'section_0'
              }]
            }
          );
        };

        $scope.addSection = function(page) {
          page.sections.push({
            title: 'Section',
            id: 'section_'+page.sections.length
          });
        };

        $scope.scrollToDiv = function(page, div) {
          $scope.currentPage = page;
          $timeout(function() {
            $('html,body').animate({
              scrollTop: $(div).offset().top
            });
          }, 100);

        };

  });
