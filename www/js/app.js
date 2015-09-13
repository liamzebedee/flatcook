// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

$stateProvider.state('tab.eat', {
  abstract: true,
  url: '/eat',
  views: {
    eat: {
      template: '<ion-nav-view></ion-nav-view>'
    }
  }
})

$stateProvider.state('tab.eat.index', {
  url: '',
  templateUrl: 'templates/tab-eat.html',
  controller: 'EatCtrl'
})

$stateProvider.state('tab.eat.detail', {
  url: '/{id:[0-9]*}',
  templateUrl: 'templates/tab-eat-detail.html',
  controller: 'EatDetailCtrl'
})

$stateProvider.state('tab.eat.eating', {
  url: '/eating',
  templateUrl: 'templates/tab-eat-eating.html',
  controller: 'EatingCtrl'
})

  .state('tab.cook', {
      url: '/cook',
      views: {
        'tab-cook': {
          templateUrl: 'templates/tab-cook.html',
          controller: 'CookCtrl'
        }
      }
    })

  .state('tab.profile', {
    url: '/profile',
    views: {
      'tab-profile': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('loginWelcome', {
    url: '/login-welcome',
    templateUrl: 'templates/login-welcome.html',
    controller: 'LoginWelcomeCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login-welcome');







  // Config
  // ------

  $ionicConfigProvider.scrolling.jsScrolling(false); // more native scrolling
  $ionicConfigProvider.views.transition("ios");


})


.directive('formattedTime', function ($filter) {

  return {
    require: '?ngModel',
    link: function(scope, elem, attr, ngModel) {
        if( !ngModel )
            return;
        if( attr.type !== 'time' )
            return;
                
        ngModel.$formatters.unshift(function(value) {
            return value.replace(/:[0-9]+.[0-9]+$/, '');
        });
    }
  };
  
});
