'use strict';

/**
 * @ngdoc overview
 * @name portfolioApp
 * @description
 * # portfolioApp
 *
 * Main module of the application.
 */
angular.module('portfolioApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'firebase.ref',
    'firebase.auth',
    'ui.router',
    'angular-parallax',
    'ngDragDrop',
    'colorpicker.module',
    'ui.bootstrap'
  ])
  /*.run(function ($firebaseArray, Ref, themeService) {
    var themes = $firebaseArray(Ref.child('admin').child('default').child('themes'));
    themes.$loaded().then(function () {
      themeService.addRules(themes);
    });
  })*/;
