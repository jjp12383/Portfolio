angular.module("portfolioApp").directive('casButton', function() {
  'use strict';

  return {
    restrict: 'A',
    transclude: true,
    templateUrl: 'components/cas/buttons/partials/casButtonPartial.html'
  };
});
