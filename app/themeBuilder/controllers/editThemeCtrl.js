angular.module('portfolioApp')
  .controller('EditThemeCtrl', function ($scope, Auth, $location, $q, Ref, $timeout, $firebaseObject, $firebaseArray, $sce, themeService, $rootScope) {
    $scope.theme = $rootScope.editTheme;
    $scope.trustAsHtml = function (input) {
      return $sce.trustAsHtml(input);
    }
    $timeout(function() {
      $scope.element = angular.element(document.querySelectorAll('#elementContainer')[0].children);
      $scope.expand = angular.element(document.querySelectorAll('[data-toggle="dropdown"]'));
      if($scope.expand) {
        $scope.element.addClass('open');
      }
    }, 100);

    $scope.selectElement = function () {
      $scope.$broadcast('selectElement');
    }
  });
