angular.module('flatcook.controllers', ['ngCordova', 'flatcook.services'])



.controller('MealsIndexCtrl', function($scope, $state, MealsService, UsersService, $q) {
  $scope.$on('$ionicView.beforeEnter', function(e) {

    // var position = navigator.geolocation.getCurrentPosition(
    //   function(position){
    //     // Finding meals near you
    //     MealsService.getMeals(UsersService.usersService, position).then(function(meals){
    //       $scope.meals = meals;
    //     });
    //   },
      
    //   function(error){
    //     throw new Error(error); // TODO
    //   }, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }
    // );

  });

  $scope.selectMeal = function(id) {
    $state.go('tab.eat.mealDetail', { id: id });
  };

  $scope.doRefresh = function() {
    $scope.$broadcast('scroll.refreshComplete');
  };
})



.controller('MealDetailCtrl', function($scope, $state, $stateParams, $ionicLoading, MealsService, UsersService) {
  $scope.$on('$ionicView.beforeEnter', function(e) {
    MealsService.getMeal($stateParams.id).then(function(meal){
      $scope.meal = meal;
    });
  });

  $scope.joinMeal = function(){
    if(UsersService.userNeedsToLinkPaymentMethod()) {
      // show link payment method dialog
      // wait on auth
    }

    MealsService.joinMeal($scope.meal.id);
    // erase history now
    $state.go('tab.eat.eating');
  };
})



.controller('EatingCtrl', function($scope, $stateParams, $ionicModal, MealsService) {
  $scope.optionsForStatusChooser = ["Chilling out", 'On my way'];

  $scope.$on('$ionicView.beforeEnter', function(e) {
    MealsService.getMeal(MealsService.currentMealID).then(function(meal){
      $scope.meal = meal;
      $scope.meal.numberOfGuestsInWords = numberInWords(meal.guests.length);
      $scope.meal.userStatus = $scope.optionsForStatusChooser[0];

      $ionicModal.fromTemplateUrl('/templates/partials/statusChooserModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.statusChooserModal = modal;
      });
    })
  });

  $scope.openStatusChooser = function(){
    $scope.statusChooserModal.show();
  };

  $scope.closeStatusChooser = function() {
    $scope.statusChooserModal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.statusChooserModal.remove();
  });
})



.controller('NewMealCtrl', function($scope) {
  $scope.$on('$ionicView.enter', function(e) {
  }); 
})



.controller('ProfileCtrl', function($scope, $state) {
  $scope.signOut = function(){
    $state.go('login');
  };
})



.controller('LoginCtrl', function($scope, $state, UsersService) {
  $scope.login = function() {
    try {
      UsersService.login();
      $state.go('tab.eat.mealsIndex');
    } catch(ex) {
      throw ex;
    }
  };
});
