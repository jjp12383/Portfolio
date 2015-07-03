angular.module('portfolioApp')
  .directive('offCanvas', function (themeService) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var toggleButton = angular.element(document.querySelectorAll("#toggleOffMenu")),
            toggleButtonTwo = angular.element(document.querySelectorAll("#toggleOffMenu2"));
        toggleButton.click(function () {
          element.toggleClass('active');
          themeService.addNameSpace(toggleButton, 'padding', '20px 30px', 'test');
          toggleButton.toggleClass('test');
        });
        toggleButtonTwo.click(function () {
          themeService.addNameSpace(toggleButtonTwo, 'background-color', '#000000', 'test');
        })
      }
    }
  })
