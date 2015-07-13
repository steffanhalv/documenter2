'use strict';
angular.module('documenter2App')
  .controller('EditCtrl', function ($rootScope, $routeParams, $scope, $location, $timeout, gapi) {

        $scope.project = {
            userPermission: {
                role: 'reader'
            }
        };
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
            toolbar: ["undo redo | styleselect fontsizeselect | bullist | bold italic underline | forecolor backcolor | link image | numlist"],
            skin: 'lightgray',
            theme : 'modern'
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
                            $rootScope.projects = resp.items;
                        });
                    }
                });

            });
        };

        $scope.getFile = function(fileId) {
            gapi.authorize({
                done: function(resp) {
                gapi.getFile(fileId, function(resp) {
                    $scope.project = resp;

                    gapi.downloadFile(resp.downloadUrl, function(resp) {
                        $scope.$apply(function() {
                            $scope.pages = angular.fromJson(resp);
                            $scope.currentPage = $scope.pages[0];
                            $scope.currentSection = $scope.currentPage.sections[0];
                        });
                    });
                });
                }
            });
        };
        if ($routeParams.id=='new') {

            var name = prompt("Please enter new filename", "Filename");
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
                $scope.$apply(function() {

                    $scope.getFile(resp.id);

                    //refresh project list
                    gapi.listProjects({
                        done: function(resp) {
                            $scope.$apply(function() {
                                $rootScope.projects = resp.items;
                            });
                        }
                    });
                });
            });
        } else {
            $scope.getFile($routeParams.id);
        }

        $scope.export = function() {
            $.ajax({
                type: 'POST',
                url: 'http://docswriter.com/php/export.php',
                data: angular.toJson({
                    pages: $scope.pages,
                    user: $scope.user
                }),
                success: function(filename) {
                    setTimeout(window.location = 'http://docswriter.com/php/'+filename, 1000);
                }
            });
        };

        $scope.removeSection = function(currentPage, index) {
            currentPage.sections.splice(index, 1);
        };

        $scope.removePage = function(index) {
            $scope.pages.splice(index, 1);
        };

        $scope.addSection = function(page) {
            page.sections.push({
                title: 'Section',
                id: 'section_'+page.sections.length,
                model: ''
            });
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

        $scope.switchPage = function(page, index) {
            $scope.currentPage = page;
            $scope.currentPageIndex = index;
        };

        $scope.switchSection = function(section) {
            $scope.currentSection = section;
        };

        $scope.share = function() {
            gapi.share($scope.project.id);
        };

        $scope.delete = function() {
            gapi.delete($scope.project.id, function(resp) {

                gapi.listProjects({
                    done: function(resp) {
                        $scope.$apply(function() {
                            $rootScope.projects = resp.items;
                            $location.path('/');
                        });
                    }
                });

            });
        };

        /*Autosave
         $scope.$watch('pages', function() {
         localStorage['storage'] = angular.toJson($scope.pages);
         }, true);*/

  });
