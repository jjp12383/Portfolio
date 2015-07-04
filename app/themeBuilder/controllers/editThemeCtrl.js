angular.module('portfolioApp')
  .controller('EditThemeCtrl', function ($scope, Auth, $location, $q, Ref, $timeout, $firebaseObject, $firebaseArray, $sce, themeService, $rootScope) {
    $scope.theme = $rootScope.editTheme;

    $scope.trustAsHtml = function (input) {
      return $sce.trustAsHtml(input);
    }
  });
