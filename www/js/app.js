angular.module('flatcook', ['ionic', 'flatcook.controllers', 'flatcook.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    var FB_APP_ID = '956199011086032';
    var FB_VERSION = ""; // I don't care.
    if (window.cordova && window.cordova.platformId == "browser") {
      $cordovaFacebookProvider.browserInit(FB_APP_ID, FB_VERSION);
    }


    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Routing
  // -------

  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })



  .state('tab.eat', {
    abstract: true,
    url: '/eat',
    views: {
      'tab-eat': {
        template: "<ion-nav-view></ion-nav-view>"
      }
    }
  })

  .state('tab.eat.mealsIndex', {
    url: '/index',
    templateUrl: 'templates/eat-mealsIndex.html',
    controller: 'MealsIndexCtrl'
  })

  .state('tab.eat.mealDetail', {
    url: '/meal/{id:[0-9]*}',
    templateUrl: 'templates/eat-mealDetail.html',
    controller: 'MealDetailCtrl'
  })

  .state('tab.eat.eating', {
    url: '/eating',
    templateUrl: 'templates/eat-eating.html',
    controller: 'EatingCtrl'
  })




  .state('tab.cook', {
    url: '/cook',
    views: {
      'tab-cook': {
        templateUrl: 'templates/cook.html',
        controller: 'NewMealCtrl'
      }
    }
  })




  .state('tab.profile', {
    url: '/profile',
    views: {
      'tab-profile': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })




  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  });




  $urlRouterProvider.otherwise('/login');


  // Config
  // ------

  $ionicConfigProvider.scrolling.jsScrolling(false); // more native scrolling
  $ionicConfigProvider.views.transition("ios");
});
