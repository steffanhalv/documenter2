'use strict';

/**
 * @ngdoc function
 * @name documenter2App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the documenter2App
 */
angular.module('documenter2App')
  .controller('MainCtrl', function ($scope, $timeout, $location, gapi) {

    $scope.project = {};
    $scope.saving = false;

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

    $scope.createToDrive = function() {

      $scope.saving = true;
      $location.path('/');
      $scope.project.title = 'Project title';

      $scope.pages = [
        {
          title: 'Page title',
          sections: [{
            title: 'Section title',
            id: 'section_0',
            model: ''
          }]
        }
      ];
      $scope.currentPageIndex = 0;
      $scope.currentPage = $scope.pages[0];
      $scope.currentSection = $scope.currentPage.sections[0];

      gapi.insertFile($scope.project.title, 'appfolder', angular.toJson($scope.pages), function(resp) {
        $scope.$apply(function() {

          $scope.project = resp;
          $scope.saving = false;

          //refresh project list
          gapi.listProjects({
            done: function(resp) {
              $scope.$apply(function() {
                $scope.projects = resp.items;
              });
            }
          });
        });
      });

    };

    $scope.saveToDrive = function() {
      $scope.saving = true;
      gapi.updateFile($scope.project.id, {
        'title': $scope.project.title,
        'mimeType': $scope.project.mimeType,
        'parents': $scope.project.parents
      }, angular.toJson($scope.pages), function(resp) {

        $scope.$apply(function() {
          $scope.saving = false;
        });

        //refresh project list
        gapi.listProjects({
          done: function(resp) {
            $scope.$apply(function() {
              $scope.projects = resp.items;
            });
          }
        });

      });
    };

    $scope.deleteProject = function() {
      //@todo
    };

    $scope.share = function() {
        gapi.share('1QvAK3Its-LB8G3gJgFFZDbkWPhUz-JPG3avcSRJ5fKI');
    };

    $scope.user = {};
    gapi.authorize({
      done: function(resp) {

        //AFTER AUTH
        gapi.getUser({
          done: function(resp) {
            $scope.user = resp;
          }
        });

        gapi.downloadFile('https://doc-0o-bg-docs.googleusercontent.com/docs/securesc/7322jpkgmnqb68ih8764qrrag7rm6346/8sdlq6t379uk24o40eipsut5rre1vsml/1435867200000/03090252842654316510/03090252842654316510/1l64wUv8C9gypNkbr3HcSIVr2PjkONjnMPpQ-_u45rRM?e=download&gd=true',
        function(resp){
          console.log('File downloaded');
        });

        gapi.listProjects({
          done: function(resp) {
            $scope.$apply(function() {
              $scope.projects = resp.items;
            });
          }
        });

        gapi.listShared({
          done: function(resp) {
            $scope.$apply(function() {
              $scope.sharedProjects = resp.items;
            });
          }
        });
      }
    });

    /*Autosave
    $scope.$watch('pages', function() {
      localStorage['storage'] = angular.toJson($scope.pages);
    }, true);*/

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

    $scope.loadFile = function(file) {

      $location.path('/');
      $scope.project = file;

      gapi.downloadFile(file.downloadUrl, function(resp) {
        $scope.$apply(function() {
          $scope.pages = angular.fromJson(resp);
          $scope.currentPage = $scope.pages[0];
          $scope.currentSection = $scope.currentPage.sections[0];
        });
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
