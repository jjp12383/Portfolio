'use strict';
/**
 * @ngdoc overview
 * @name portfolioApp:routes
 * @description
 * # routes.js
 *
 * Configure routes for use with Angular, and apply authentication security
 * Add new routes using `yo angularfire:route` with the optional --auth-required flag.
 *
 * Any controller can be secured so that it will only load if user is logged in by
 * using `whenAuthenticated()` in place of `when()`. This requires the user to
 * be logged in to view this route, and adds the current user into the dependencies
 * which can be injected into the controller. If user is not logged in, the promise is
 * rejected, which is handled below by $routeChangeError
 *
 * Any controller can be forced to wait for authentication to resolve, without necessarily
 * requiring the user to be logged in, by adding a `resolve` block similar to the one below.
 * It would then inject `user` as a dependency. This could also be done in the controller,
 * but abstracting it makes things cleaner (controllers don't need to worry about auth state
 * or timing of displaying its UI components; it can assume it is taken care of when it runs)
 *
 *   resolve: {
 *     user: ['Auth', function(Auth) {
 *       return Auth.$getAuth();
 *     }]
 *   }
 *
 */
angular.module('portfolioApp')

/**
 * Adds a special `whenAuthenticated` method onto $routeProvider. This special method,
 * when called, invokes Auth.$requireAuth() service (see Auth.js).
 *
 * The promise either resolves to the authenticated user object and makes it available to
 * dependency injection (see AccountCtrl), or rejects the promise if user is not logged in,
 * forcing a redirect to the /login page
 */
  .config(['$stateProvider', 'SECURED_ROUTES', '$urlRouterProvider', function($stateProvider, SECURED_ROUTES, $urlRouterProvider) {
    // credits for this idea: https://groups.google.com/forum/#!msg/angular/dPr9BpIZID0/MgWVluo_Tg8J
    // unfortunately, a decorator cannot be use here because they are not applied until after
    // the .config calls resolve, so they can't be used during route configuration, so we have
    // to hack it directly onto the $routeProvider object
    $stateProvider.whenAuthenticated = function(path, route) {
      route.resolve = route.resolve || {};
      route.resolve.user = ['Auth', function(Auth) {
        return Auth.$requireAuth();
      }];
      $stateProvider.state(path, route);
      SECURED_ROUTES[path] = true;
      return $stateProvider;
    };
  }])

  // configure views; whenAuthenticated adds a resolve method to ensure users authenticate
  // before trying to access that route
  .config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/main');

    $stateProvider

      .state('home', {
        url: '/',
        templateUrl: 'main/partials/mainPartial.html'
      })

      .state('contact', {
        url: '/contact',
        templateUrl: 'contact/partials/contactPartial.html'
      })

      .state('portfolio', {
        url: '/portfolio',
        templateUrl: 'portfolio/partials/portfolioPartial.html'
      })

      .state('uiTestBed', {
        url: '/uiTestBed',
        templateUrl: 'uiTestBed/partials/uiTestBedPartial.html'
      })

      .state('bookcase', {
        url: '/bookcase',
        templateUrl: 'bookcase/partials/bookcasePartial.html'
      })

      .state('admin', {
        url: '/admin',
        templateUrl: 'adminConsole/partials/adminConsolePartial.html'
      })

      .state('about', {
        url: '/about',
        templateUrl: 'about/partials/aboutPartial.html'
      })

      .state('themeBuilder', {
        url: '/themeBuilder',
        templateUrl: 'themeBuilder/partials/themeBuilderPartial.html'
      })

      .state('themeBuilder.bootstrap', {
        url: '/bootstrap',
        templateUrl: 'themeBuilder/bootstrap/partials/bootstrapMenuPartial.html'
      })

      .state('themeBuilder.foundation', {
        url: '/foundation',
        templateUrl: 'themeBuilder/foundation/partials/foundationMenuPartial.html'
      })

      .state('themeBuilder.skeleton', {
        url: '/skeleton',
        templateUrl: 'themeBuilder/skeleton/partials/skeletonMenuPartial.html'
      })

      .state('editTheme', {
        url: '/themeBuilder/editTheme',
        templateUrl: 'themeBuilder/partials/editThemePartial.html'
      })

      .state('casSandbox', {
        url: '/casSandbox',
        templateUrl: 'casSandbox/partials/casSandboxPartial.html'
      })

      .state('login', {
        url: '/login',
        views:{
          content:{
            templateUrl: 'login/partials/login.html'
          }
        }
      })

      .whenAuthenticated('account', {
        url: '/account',
        views:{
          content:{
            templateUrl: 'account/partials/account.html'
          }
        }
      });
  }])

  /**
   * Apply some route security. Any route's resolve method can reject the promise with
   * "AUTH_REQUIRED" to force a redirect. This method enforces that and also watches
   * for changes in auth status which might require us to navigate away from a path
   * that we can no longer view.
   */
  .run(['$rootScope', '$location', 'Auth', 'SECURED_ROUTES', 'loginRedirectPath',
    function($rootScope, $location, Auth, SECURED_ROUTES, loginRedirectPath) {
      // watch for login status changes and redirect if appropriate
      Auth.$onAuth(check);

      // some of our routes may reject resolve promises with the special {authRequired: true} error
      // this redirects to the login page whenever that is encountered
      $rootScope.$on('$routeChangeError', function(e, next, prev, err) {
        if( err === 'AUTH_REQUIRED' ) {
          $location.path(loginRedirectPath);
        }
      });

      function check(user) {
        if( !user && authRequired($location.path()) ) {
          $location.path(loginRedirectPath);
        }
      }

      function authRequired(path) {
        return SECURED_ROUTES.hasOwnProperty(path);
      }

      $rootScope.$on('$viewContentLoaded',
        function(event, toState, toParams, fromState, fromParams){
          grunticon.svgLoadedCallback()
        });

    }
  ])

  // used by route security
  .constant('SECURED_ROUTES', {});
