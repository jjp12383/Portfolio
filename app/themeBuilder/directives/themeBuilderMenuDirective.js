angular.module('portfolioApp')
  .directive('styleMenu', function ($window, $document, themeService) {
    return {
      restrict: 'A',
      controller: function () {
        this.updateStyle = function (style) {
          console.log(style);
        }
      }
    }

  })
  .directive('styleGroup', function (themeService, $rootScope) {
    return {
      restrict: 'A',
      require: "^styleMenu",
      controller: function ($scope, $element) {
        var cssProperty;
        $scope.$on('elementSelected', function(event, data) {
          $scope.element = data;
          cssProperty = angular.element($element.find('label').eq(0));
          cssProperty = cssProperty[0].innerHTML.toLowerCase().replace(' ', '-');
        });

        this.updateStyleValue = function (value) {
          var rules = [
            {
              property: cssProperty,
              value: value
            }
          ];
          themeService.addNameSpace($scope.element, rules, 'test');
          $scope.element.addClass('test');
        }
      }
    }
  })
  .directive('styleInput', function () {
    return {
      restrict: 'A',
      require: "^styleGroup",
      link: function (scope, element, attrs, styleGroupCtrl) {
        element.on('blur', function () {
          var value = element.val();
          styleGroupCtrl.updateStyleValue(value);
        })
      }
    }
  });
