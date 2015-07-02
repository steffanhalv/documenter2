'use strict';

/**
 * @ngdoc function
 * @name documenter2App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the documenter2App
 */
angular.module('documenter2App')
  .controller('MainCtrl', function ($scope, $timeout, gapi) {
        $scope.tinymceOptions = {
            setup: function (ed) {
                ed.on("change", function () {

                  //localStorage['storage'] = angular.toJson($scope.pages);

                });
            },
            inline: true,
            plugins : 'advlist autolink link image lists charmap print preview textcolor code',
            menubar : false,
            toolbar: ["undo redo | styleselect fontsizeselect | bullist ", " bold italic underline | forecolor backcolor | link image | numlist"],
            skin: 'lightgray',
            theme : 'modern'
        };

        $scope.saveToDrive = function() {
            gapi.insertFile('config.json', 'appfolder', angular.toJson($scope.pages), function(resp) {
                console.log(resp);
            });
        };

        $scope.share = function() {
            gapi.share('1QvAK3Its-LB8G3gJgFFZDbkWPhUz-JPG3avcSRJ5fKI');
        };

        $scope.user = {};
        gapi.authorize({
          done: function(resp) {
            console.log(resp);
            gapi.getUser({
              done: function(resp) {
                console.log(resp);
                $scope.user = resp;
              }
            });
            gapi.downloadFile('https://doc-0o-bg-docs.googleusercontent.com/docs/securesc/7322jpkgmnqb68ih8764qrrag7rm6346/8sdlq6t379uk24o40eipsut5rre1vsml/1435867200000/03090252842654316510/03090252842654316510/1l64wUv8C9gypNkbr3HcSIVr2PjkONjnMPpQ-_u45rRM?e=download&gd=true',
            function(resp){
              console.log(resp);
            });
          }
        });

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
            data: angular.toJson({
              pages: $scope.pages,
              user: $scope.user
            }),
            success: function(filename) {
              console.log(filename);
              setTimeout(window.location = 'http://documenter.com/app/php/'+filename, 1000);
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
