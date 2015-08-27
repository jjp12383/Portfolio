'use strict';
/**
 * @ngdoc function
 * @name portfolioApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * A demo of using AngularFire to manage a synchronized list.
 */
angular.module('portfolioApp')
  .controller('UITestBedCtrl', function ($scope, Ref, $firebaseArray, $timeout) {
    $scope.minValue = 0;
    $scope.maxValue = 5;
    $scope.colors = ['#dd4509','#ff8201','#e6c00d','#b9dd36','#76c13a'];
    $scope.segments = ['na', 'poor', 'below average', 'average', 'good', 'excellent'];
  });
