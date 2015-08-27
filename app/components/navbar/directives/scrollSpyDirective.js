angular.module('portfolioApp')
  .directive('scrollSpy', function ($window, $document) {
  return {
    restrict: 'AE',
    link: function (scope, element) {
      angular.element($window).bind("scroll", function(e) {
        var distanceY = $window.pageYOffset,
          shrinkOn = 300,
          header = element;
        if (distanceY > shrinkOn) {
          element.addClass('header-scrolled');
        } else {
          if (element.hasClass('header-scrolled')) {
            element.removeClass('header-scrolled')
          }
        }
      });
    }
  }
  });
