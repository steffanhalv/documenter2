'use strict';

/**
 * @ngdoc function
 * @name documenter2App.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the documenter2App
 */
angular.module('documenter2App')
  .controller('DashboardCtrl', function ($scope, $rootScope, $location, gapi) {

    $scope.delete = function(id) {
      if (confirm("Sure you want to delete this document?")) {
        gapi.delete(id, function(resp) {

          gapi.listProjects({
            done: function(resp) {
              $scope.$apply(function() {
                $rootScope.projects = resp.items;
              });
            }
          });

        });
      }
    };

    $scope.new = function() {

      var name = prompt("Please enter new filename", "");

      if (name!==null) {

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

        gapi.insertFile(name, 'appfolder', angular.toJson($scope.pages), function(resp) {

          $location.path('/edit/'+resp.id);
          //refresh project list
          gapi.listProjects({
            done: function(resp) {
              $scope.$apply(function() {
                $rootScope.projects = resp.items;
              });
            }
          });

        });
      }

    };

  });
