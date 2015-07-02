angular.module('portfolioApp')
  .controller('ThemesCtrl', function ($scope, Auth, $location, $q, Ref, $timeout, $firebaseArray, themeService) {

    $scope.primaryThemeColor = null;
    $scope.secondaryThemeColor = null;
    $scope.tertiaryThemeColor = null;
    $scope.iconThemeColor = null;
    $scope.fontThemeColor = null;

    $scope.$on('colorpicker-selected', function(event, colorObject){
      if($scope.primaryThemeColor !== null) {
        var trialThemes = [
          {
            themeClass: ".themed",
            rules: [
              {
                property: 'background-color',
                value: 'blue'
              }
            ]
          }
        ];
        themeService.addRules(trialThemes);
      }
      if ($scope.secondaryThemeColor !== null) {
        var sTheme = themeService.addCSSRule('.secondary-themed');
        sTheme.style.cssText = "background-color: " + $scope.secondaryThemeColor + " !important;";
      }
      if ($scope.tertiaryThemeColor !== null) {
        var tTheme = themeService.addCSSRule('.tertiary-themed');
        tTheme.style.cssText = "background-color: " + $scope.tertiaryThemeColor + " !important;";
      }
      if ($scope.iconThemeColor !== null) {
        var iTheme = themeService.addCSSRule('.icon-themed');
        iTheme.style.cssText = "fill: " + $scope.iconThemeColor + " !important;";
      }
      if ($scope.fontThemeColor !== null) {
        var fTheme = themeService.addCSSRule('li, p, span, a');
        fTheme.style.cssText = "color: " + $scope.fontThemeColor + " !important;";
      }
    });


  });
