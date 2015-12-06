IsServingBrowserFromIonicServe = !window.cordova;


angular.module('flatcook', ['ionic', 'flatcook.controllers', 'flatcook.services', 'ui.router.stateHelper'])

.run(function($ionicPlatform, $rootScope) {
  $rootScope.$on("$stateChangeError", console.log.bind(console));

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleLightContent();
    }

  });
})

.config(function($stateProvider, stateHelperProvider, $urlRouterProvider, $ionicConfigProvider, $cordovaFacebookProvider) {

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
    url: '',
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
    abstract: true,
    url: '/cook',
    views: {
      'tab-cook': {
        template: "<ion-nav-view></ion-nav-view>"
      }
    }
  })

  .state('tab.cook.newMeal', {
    abstract: true,
    controller: 'NewMealCtrl',
    views: {
      'newMealForm': {
        template: '<ion-nav-view></ion-nav-view>'
      }
    }
  })

  .state('tab.cook.newMeal.intro', {
    url: '/intro',
    templateUrl: 'templates/cook-newMeal.html'
  })
  .state('tab.cook.newMeal.step1', {
    url: '/step1',
    templateUrl: 'templates/cook-newMeal-step1.html'
  })
  .state('tab.cook.newMeal.step2', {
    url: '/step2',
    templateUrl: 'templates/cook-newMeal-step2.html'
  })
  .state('tab.cook.newMeal.step3', {
    url: '/step3',
    templateUrl: 'templates/cook-newMeal-step3.html'
  })


  .state('tab.cook.cooking', {
    url: '/cooking',
    templateUrl: 'templates/cook-cooking.html',
    controller: 'CookingCtrl'
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


  // Facebook
  // --------
    var FB_APP_ID = '956199011086032';
    var FB_VERSION = ""; // I don't care.
    if (IsServingBrowserFromIonicServe) {
      window.fbAsyncInit = function(){ $cordovaFacebookProvider.browserInit(FB_APP_ID, FB_VERSION) };
    }

});
