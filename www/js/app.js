IsServingBrowserFromIonicServe = !window.cordova;


angular.module('flatcook', ['ionic', 'flatcook.controllers', 'flatcook.services', 'ui.router.stateHelper'])

.run(function($ionicPlatform, $rootScope, $state) {

  $ionicPlatform.ready(function() {
    $rootScope.$on("$stateChangeError", console.log.bind(console));

    // Icky hack for ui-router
    // I have searched for 3+ hours on how to not make this a hack.
    // This is the only alternative.
    $rootScope.$on('$stateChangeStart', function(evt, to, params) {
      if (to.dynamicallySelectState) {
        evt.preventDefault();
        $state.go(to.dynamicallySelectState(), params)
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

.config(function($stateProvider, stateHelperProvider, $urlRouterProvider, $ionicConfigProvider, $cordovaFacebookProvider) {

  // stateHelperProvider.state({
  //   name: 'tab',
  //   url: '/tab',
  //   abstract: true,
  //   templateUrl: 'templates/tabs.html',
  //   children: [
  //     {
  //       abstract: true,
  //       url: '/eat',
  //       views: {
  //         'tab-eat': {
  //           template: "<ion-nav-view></ion-nav-view>"
  //         }
  //       }
  //     }
  //   ]

  // })

  // Routing
  // -------

  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })



    //
    //  Eating tab
    //

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


/* 
 * How the router works.
 * 
 * State - a state is 
 * View
 * Tab - a tab is simply yet another view that doesn't change
 * Page - a page consists of various views that make it up
 * 

 State
   View A
   View B


Home page.

How do multiple nested states work?


have to reconcile:
a) controller (JS)
b) template (HTML)

Open cooking page
if(cookingCurrently) {
  controller: foo
  template: bar 
} else {
  
}
 */


    //
    //  Cooking tab
    //

    .state('tab.cook', {
      abstract: false,
      url: '/cook',
      views: {
        'tab-cook': {
          template: "<ion-nav-view></ion-nav-view>"
        }
      },
      dynamicallySelectState: function() {
        if(false) {
          return 'tab.cook.cooking';
        } else {
          return 'tab.cook.newMeal';
        };
      }
    })

      .state('tab.cook.newMeal', {
        url: '/newMeal',
        templateUrl: 'templates/cook-newMeal.html',
        controller: 'NewMealCtrl',
        // views: {
        //   'newMealFormx': {
            
        //     template: "<ion-nav-view></ion-nav-view>"
        //   }
        // },
      })

        // .state('tab.cook.newMeal.intro', {
        //   url: '',
        //   templateUrl: 'templates/cook-newMeal.html'
        // })
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




  // $urlRouterProvider.otherwise('/tab/eat');

$urlRouterProvider.otherwise(function($injector, $location){
  console.log($injector)
  console.log($location)
})

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
