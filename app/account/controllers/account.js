'use strict';
/**
 * @ngdoc function
 * @name muck2App.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Provides rudimentary account management functions.
 */
angular.module('portfolioApp')
  .controller('AccountCtrl', function ($scope, user, Auth, Ref, $firebaseObject, $firebaseArray, $timeout, $rootScope, $localStorage) {
    $scope.user = user;
    $scope.logout = function() {
      $localStorage.$reset();
      $rootScope.user = {};
      Auth.$unauth();
    };
    $scope.chocolates = $firebaseArray(Ref.child('chocolates'));
    $scope.messages = [];
    var profile = $firebaseObject(Ref.child('users/'+user.uid));
    profile.$loaded().then(function () {
      $scope.profile = profile;

      $scope.changeName = function () {
        profile.$save();
      }

      $scope.changePassword = function(oldPass, newPass, confirm) {
        $scope.err = null;
        if( !oldPass || !newPass ) {
          error('Please enter all fields');
        }
        else if( newPass !== confirm ) {
          error('Passwords do not match');
        }
        else {
          Auth.$changePassword({email: profile.email, oldPassword: oldPass, newPassword: newPass})
            .then(function() {
              success('Password changed');
            }, error);
        }
      };

      $scope.changeEmail = function(pass, newEmail) {
        $scope.err = null;
        Auth.$changeEmail({password: pass, newEmail: newEmail, oldEmail: profile.email})
          .then(function() {
            profile.email = newEmail;
            profile.$save();
            success('Email changed');
          })
          .catch(error);
      };

      function error(err) {
        alert(err, 'danger');
      }

      function success(msg) {
        alert(msg, 'success');
      }

      function alert(msg, type) {
        var obj = {text: msg+'', type: type};
        $scope.messages.unshift(obj);
        $timeout(function() {
          $scope.messages.splice($scope.messages.indexOf(obj), 1);
        }, 10000);
      }
    });
  });
