angular.module('portfolioApp')
  .controller('ThemeBuilderCtrl', function ($scope, Auth, $location, $q, Ref, $timeout, $firebaseObject, $firebaseArray, $sce, themeService) {
    var themes = $firebaseArray(Ref.child('admin').child('default').child('themeBuilder').child('bootstrap')),
        menu = $firebaseObject(Ref.child('themeBuilder').child('bootstrap'));
      $scope.themes = themes;
      menu.$bindTo($scope, "menu");
      $scope.trustAsHtml = function (input) {
        return $sce.trustAsHtml(input);
      }

      $scope.dragStart = function (event, ui, item) {
        $scope.draggedUi = item;
      };

      $scope.dropped = function () {
        $scope.themes.$add($scope.draggedUi);
      };

      $scope.removeItem = function (item) {
        $scope.themes.$remove(item);
      };

      $scope.editItem = function (item) {
        themeService.editTheme(item);
      }
  });
