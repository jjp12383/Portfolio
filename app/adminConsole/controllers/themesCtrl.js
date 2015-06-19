angular.module('portfolioApp')
  .controller('ThemesCtrl', function ($scope, Auth, $location, $q, Ref, $timeout, $firebaseObject, themeService) {
    $scope.primaryThemeColor = null;
    $scope.secondaryThemeColor = null;
    $scope.tertiaryThemeColor = null;
    $scope.iconThemeColor = null;
    $scope.fontThemeColor = null;

    var primaryThemedElements = angular.element(document.querySelectorAll(".themed")),
        secondaryThemedElements = angular.element(document.querySelectorAll(".secondary-themed")),
        tertiaryThemedElements = angular.element(document.querySelectorAll(".tertiary-themed")),
        iconThemedElements = angular.element(document.querySelectorAll(".icon-themed")),
        fontThemedElements = angular.element(document.querySelectorAll(".font-themed"));

    $scope.$on('colorpicker-selected', function(event, colorObject){
      if($scope.primaryThemeColor !== null) {
        primaryThemedElements.css('background-color', $scope.primaryThemeColor);
      }
      if ($scope.secondaryThemeColor !== null) {
        secondaryThemedElements.css('background-color', $scope.secondaryThemeColor);
      }
      if ($scope.tertiaryThemeColor !== null) {
        tertiaryThemedElements.css('background-color', $scope.tertiaryThemeColor);
      }
      if ($scope.iconThemeColor !== null) {
        iconThemedElements.find('path, rect, circle, polygon').css('fill', $scope.iconThemeColor);
      }
      if ($scope.fontThemeColor !== null) {
        fontThemedElements.find('li, p, span, a').css('color', $scope.fontThemeColor);
      }
    });


  });
