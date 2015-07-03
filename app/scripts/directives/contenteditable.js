'use strict';

/**
 * @ngdoc directive
 * @name documenter2App.directive:contentEditable
 * @description
 * # contentEditable
 */
angular.module('documenter2App')
  .directive('contentEditable', function ($timeout) {
    return {
      require: '?ngModel',
      priority: 1,
      link: function(scope, element, attr, ngModel) {
        var read;
        if (!ngModel) {
          return;
        }
        ngModel.$render = function() {
          return element.html($.trim(ngModel.$modelValue));
        };
        $timeout(function() {
          element.off();
          element.on('blur click DOMNodeInserted DOMNodeRemoved DOMSubtreeModified', function() {
            if (ngModel.$viewValue !== $.trim(element.html())) {
              return scope.$apply(read);
            }
          });
        });

        return read = function() {
          return ngModel.$setViewValue($.trim(element.html()));
        };
      }
    };
  });