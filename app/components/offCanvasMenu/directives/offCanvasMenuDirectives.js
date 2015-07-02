angular.module('portfolioApp')
  .directive('offCanvas', function (themeService) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var toggleButton = angular.element(document.querySelectorAll("#toggleOffMenu"));
        toggleButton.click(function () {
          element.toggleClass('active');
          themeService.exStyle(toggleButton, 'margin', '20px 30px', 'test');
          toggleButton.toggleClass('test');
        })
      }
    }
  })
