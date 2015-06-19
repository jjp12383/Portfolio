angular.module('portfolioApp')
  .controller('AdminConsoleCtrl', function ($scope, Auth, $location, $q, Ref, $timeout, $firebaseObject) {
    var windows = $firebaseObject(Ref.child('admin').child('default').child('windows')),
        menu = $firebaseObject(Ref.child('admin').child('default').child('menu'));
    windows.$loaded().then(function () {
      windows.$bindTo($scope, "windows");
      menu.$bindTo($scope, "menu");
      $scope.openMenuItem = function (name, id) {
        var timeStamp = new Date().getTime();
        $scope.windows[timeStamp] = {
          halfScreen: false,
          name: name,
          id: id,
          createDate: timeStamp,
          height: '300',
          width: '400',
          top: 20,
          left: 30,
          open: true,
          max: false
        };
        setTimeout(function () {
          grunticon.svgLoadedCallback();
        }, 100)
      };

      $scope.showMenu = false;

      $scope.$on('CLOSE_WINDOW', function (event, data) {
        delete $scope.windows[data];
      });
    });
  });
