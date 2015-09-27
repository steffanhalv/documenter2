'use strict';
angular.module('documenter2App')
  .controller('EditCtrl', function ($rootScope, $routeParams, $scope, $location, $timeout, gapi, FileUploader) {

        $scope.uploader = new FileUploader({
          url: 'upload.php'
        });

        $scope.uploader.onAfterAddingFile = function(fileItem) {
          fileItem.upload();
        };

        $scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {
          $scope.model.logoPath = 'http://docswriter.com/images/projects/'+$scope.fileId+'/'+fileItem._file.name;
          $('.logo').css('backgroundImage','url('+$scope.model.logoPath+')');
        };

        $scope.project = {
            userPermission: {
                role: 'reader'
            }
        };
        $scope.saving = false;
        $scope.config = false;

        $scope.model = {};

        $scope.tinymceOptions = {
            setup: function (ed) {
                ed.on("change", function () {
                    //localStorage['storage'] = angular.toJson($scope.pages);
                });
            },
            inline: true,
            plugins : 'advlist jbimages autolink link image lists charmap print preview textcolor code',
            menubar : false,
            toolbar: ["bold italic underline | link image jbimages | forecolor backcolor ",
                      "styleselect fontsizeselect | numlist bullist | undo redo"],
            skin: 'lightgray',
            theme : 'modern'
        };

        $scope.sortableOptions = {
          axis: 'y',
          handle: '.draw'
        };

        $scope.saveToDrive = function() {
            $scope.saving = true;
            $scope.getImages();

            gapi.updateFile($scope.project.id, {
                'title': $scope.project.title,
                'mimeType': $scope.project.mimeType,
                'parents': $scope.project.parents
            }, angular.toJson($scope.model), function(resp) {

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

                $('.save').css({
                  backgroundColor: '#71B54A'
                });

            });
        };

        $scope.getFile = function(fileId) {
            gapi.authorize({
                done: function(resp) {
                gapi.getFile(fileId, function(resp) {

                    $scope.project = resp;
                    $scope.fileId = fileId;

                    gapi.downloadFile(resp.downloadUrl, function(resp) {
                        resp = resp.replace(/<div class=\\"mce-resizehandle\\">&#160;<br\/><\/div>/g,'');
                        $scope.$apply(function() {
                            $scope.model = angular.fromJson(resp);

                            if (typeof $scope.model.pages==='undefined') {
                              $scope.model = {
                                pages: angular.fromJson(resp)
                              }
                            }
                            $scope.currentPage = $scope.model.pages[0];
                            $scope.currentSection = $scope.currentPage.sections[0];

                            if (typeof $scope.model.logoPath!=='undefined') {
                              $('.logo').css('backgroundImage','url('+$scope.model.logoPath+')');
                            }

                            $timeout(function(){
                              $('.save').css({
                                backgroundColor: '#71B54A'
                              });
                            }, 500);

                        });
                    });

                    gapi.getUser({
                      done: function(resp) {
                        $scope.user = resp;
                        $.ajax({
                          type: 'POST',
                          //url: 'http://documenter.com/app/php/register.php',
                          url: 'http://docswriter.com/php/register.php',
                          data: angular.toJson({
                            user: resp,
                            fileId: fileId
                          }),
                          success: function() {
                            $scope.getImages();
                          }
                        });
                      }
                    });

                });
                }
            });
        };
        if ($routeParams.id=='new') {

            var name = prompt("Please enter new filename", "Filename");
            $scope.model.pages = [
                {
                    title: 'Page title',
                    sections: [{
                        title: 'Section title',
                        id: 'section_0',
                        model: ''
                    }]
                }
            ];

            gapi.insertFile(name, 'root', angular.toJson($scope.model), function(resp) {
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
                type: 'POST', //http://documenter.com/app/php/export.php - http://docswriter.com/php/export.php
                url: 'http://docswriter.com/php/export.php',
                data: angular.toJson({
                    pages: $scope.model.pages,
                    user: $scope.user,
                    model: $scope.model
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
            $scope.model.pages.splice(index, 1);
        };

        $scope.addSection = function(page) {
            page.sections.push({
                title: 'Section',
                id: 'section_'+page.sections.length,
                model: ''
            });
        };

        $scope.addPage = function() {
            $scope.model.pages.push(
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
            if (confirm("Sure you want to delete this document?")) {
              gapi.delete($scope.project.id, function (resp) {

                gapi.listProjects({
                  done: function (resp) {
                    $scope.$apply(function () {
                      $rootScope.projects = resp.items;
                      $location.path('/');
                    });
                  }
                });

              });
            }
        };

        $scope.getImages = function() {
          $.ajax({
            type: 'GET',
            url: 'http://docswriter.com/php/listImages.php',
            dataType: "json",
            success: function(json) {
              $scope.$apply(function() {
                $scope.images = [];
                $.each(json, function(){
                  $scope.images.push({
                    name: this.replace(/^.*[\\\/]/, ''),
                    url: this
                  });
                });
              });
            }
          });
          /*
          $scope.images = [
            {name: 'name', url: 'url'},
            {name: 'name', url: 'url'},
            {name: 'name long name long', url: 'url'},
            {name: 'name', url: 'url'},
            {name: 'name', url: 'url'},
            {name: 'name', url: 'url'},
            {name: 'name', url: 'url'},
            {name: 'name', url: 'url'},
            {name: 'name', url: 'url'}
          ];
          */
        };
        $scope.getImages();

        $scope.deleteImage = function(image) {
          if (confirm('Are you sure you want to remove image?')) {
            $.ajax({
              type: 'POST',
              url: 'http://docswriter.com/php/deleteImage.php',
              data: angular.toJson({
                image: image
              }),
              success: function() {
                $scope.getImages();
              }
            });
          }
        };

        $scope.$watch('model', function() {
         $('.save').css({
           backgroundColor: 'red'
         });
        }, true);

        $scope.$watch('project', function() {
          $('.save').css({
            backgroundColor: 'red'
          });
        }, true);

  });
