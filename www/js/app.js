IsServingBrowserFromIonicServe = !window.cordova;

angular.module('flatcook', ['ionic', 'ngCookies', 'angularMoment', 'timer', 'flatcook.controllers', 'flatcook.services'])

.run(function($ionicPlatform, $rootScope, $state) {

  $ionicPlatform.ready(function() {
    $rootScope.$on("$stateChangeError", console.log.bind(console));

    // Icky hack for ui-router
    // I have searched for 4+ hours on how to not make this a hack.
    // This is the only alternative.
    $rootScope.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams) {
      // if(toState.name === fromState.name) {
      //   evt.preventDefault()
      // }

      if (toState.dynamicallySelectState) {
        evt.preventDefault();
        // get hte tab controller
        debugger
        toState.something()
        
        $state.go(toState.dynamicallySelectState(), params)
      }
    });

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

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $cordovaFacebookProvider, MealsServiceProvider) {

  // Routing
  // -------
  // 
  // Be warned: Ionic's routing, which uses ui-router, has no useful documentation for anything but a simple TODO app.
  // Visit these links:
  // - https://medium.com/@gabescholz/effectively-maintaing-state-in-angularjs-applications-716738aaf5f4#.dopxalwaa
  // - https://forum.ionicframework.com/t/nested-states-3-level/1137/16
  // - http://robferguson.org/2015/01/07/ionics-sidemenu-template-and-nested-states/
  // - http://ionicframework.com/docs/api/directive/ionNavView/
  // 

  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    // controller: 'TabsController',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })



  //
  //  Eating tab
  //

  .state('tab.eat', {
    abstract: false,
    url: '/eat',
    views: {
      'tab-eat': {
        template: "<ion-nav-view></ion-nav-view>",
        controller: function($state, $ionicHistory, MealsService) {
          // $ionicHistory.nextViewOptions({ disableBack: true, disableAnimate: true, historyRoot: true })
          
          if(MealsService.currentMealID != null) {
            $state.go('tab.eat.eating')
          } else {
            $state.go('tab.eat.mealsIndex')
          }
        }
      }
    }

  })

  .state('tab.eat.mealsIndex', {
    url: '',
    views: {
      'mealsIndex@tab-eat': {
        templateUrl: 'templates/eat-mealsIndex.html',
        controller: 'MealsIndexCtrl',
      }
    }
  })

  .state('tab.eat.mealsIndex.detail', {
    url: '/meal/{id:[0-9]*}',
    templateUrl: 'templates/eat-mealDetail.html',
    controller: 'MealDetailCtrl'
  })

  .state('tab.eat.eating', {
    url: '/eating',
    templateUrl: 'templates/eat-eating.html',
        controller: 'EatingCtrl',
    // views: {
    //   'eating@tab-eat': {
    //     templateUrl: 'templates/eat-eating.html',
    //     controller: 'EatingCtrl',
    //   }
    // }
  })

  //
  //  Cooking tab
  //

  .state('tab.cook', {
    abstract: false,
    dynamicallySelectState: true,
    url: '/cook',
    views: {
      'tab-cook': {
        template: "<ion-nav-view></ion-nav-view>",
        controller: function($state, $ionicHistory, MealsService) {
          $ionicHistory.nextViewOptions({ disableBack: true, disableAnimate: true, historyRoot: false })
          if(MealsService.currentlyCooking) {
            $state.go('tab.cook.cooking')
          } else {
            $state.go('tab.cook.newMeal.intro')
          }
        }
      }
    }
  })

  .state('tab.cook.newMeal', {
    abstract: true,
    url: '/newMeal',
    controller: 'NewMealCtrl',
    template: "<ion-nav-view></ion-nav-view>"
  })

  .state('tab.cook.newMeal.intro', {
      url: '',
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


  //
  //  Profile tab
  //

  .state('tab.profile', {
    abstract: true,
    url: '/profile',
    views: {
      'tab-profile': {
        template: "<ion-nav-view></ion-nav-view>"
      }
    }
  })

  .state('tab.profile.main', {
    url: '',
    templateUrl: 'templates/profile.html',
    controller: 'ProfileCtrl'
  })

  .state('tab.profile.history', {
    url: '/history',
    templateUrl: 'templates/profile-history.html',
    controller: 'ProfileHistoryCtrl'
  })


  //
  //  Other tabs
  //

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })



  .state('rating', {
    abstract: true,
    url: '/rating',
    controller: 'RatingCtrl',
    template: "<ion-nav-view></ion-nav-view>"
  })

  .state('rating.chefs', {
    abstract: false,
    url: '/chefs',
    controller: 'ChefRatingCtrl',
    template: "<ion-nav-view></ion-nav-view>"
  })

  .state('rating.chefs.step1', {
    url: '/step1',
    templateUrl: 'templates/rating-chef-step1.html'
  })

  .state('rating.chefs.step2', {
    url: '/step2',
    templateUrl: 'templates/rating-chef-step2.html'
  })

  // Config
  // ------

  $ionicConfigProvider.scrolling.jsScrolling(false); // more native scrolling
  $ionicConfigProvider.views.transition("ios");


  // Facebook
  // --------
  
  var FB_APP_ID = '969671363072130';
  var FB_VERSION = "v2.5"; // I don't care.
  if (IsServingBrowserFromIonicServe) {
    window.fbAsyncInit = function() {
      $cordovaFacebookProvider.browserInit(FB_APP_ID, FB_VERSION)
    };
  }


  // Routing
  // -------

  if (IsServingBrowserFromIonicServe) {
    $urlRouterProvider.otherwise(function($injector, $location) {
      console.error("Navigated to a state that didn't exist - uh oh, spaghettios!");
      console.log($injector)
      console.log($location)
      debugger
    })
    $urlRouterProvider.when('', '/login');
  } else {
    $urlRouterProvider.otherwise('/login');
  }

});