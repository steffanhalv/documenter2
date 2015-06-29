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

                  //localStorage['storage'] = angular.toJson($scope.pages);

                });
            },
            inline: true,
            plugins : 'advlist autolink link image lists charmap print preview textcolor code',
            toolbar: ["undo redo | styleselect fontsizeselect | bold italic underline | link image | alignleft aligncenter alignright | bullist numlist outdent indent | forecolor backcolor | code"],
            skin: 'lightgray',
            theme : 'modern'
        };

        var pages = angular.fromJson(localStorage['storage']);

        if (typeof pages!='undefined') {
          $scope.pages = pages;
        } else {
          $scope.pages = [
            {
              title: 'Page',
              sections: [{
                title: 'Section',
                id: 'section_0',
                model: ''
              }]
            }
          ];
        }

        $scope.$watch('pages', function() {
          localStorage['storage'] = angular.toJson($scope.pages);
        }, true);

        $scope.currentPageIndex = 0;
        $scope.currentPage = $scope.pages[0];
        $scope.currentSection = $scope.currentPage.sections[0];
        $scope.switchPage = function(page, index) {
            $scope.currentPage = page;
            $scope.currentPageIndex = index;
        };
        $scope.switchSection = function(section) {
          $scope.currentSection = section;
        };

        $scope.addPage = function() {
          $scope.pages.push(
            {
              title: 'Page',
              sections: [{
                title: 'Section',
                id: 'section_0',
                model: ''
              }]
            }
          );
        };

        $scope.addSection = function(page) {
          page.sections.push({
            title: 'Section',
            id: 'section_'+page.sections.length,
            model: ''
          });
        };

        $scope.removeSection = function(currentPage, index) {
            currentPage.sections.splice(index, 1);
        };

        $scope.removePage = function(index) {
            $scope.pages.splice(index, 1);
        };

        $scope.export = function() {
          $.ajax({
            type: 'POST',
            url: 'http://documenter.com/app/php/export.php',
            data: angular.toJson($scope.pages),
            success: function(msg) {
              console.log(msg);
            }
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
