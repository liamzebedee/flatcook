angular.module('flatcook.controllers', ['flatcook.services'])



.controller('MealsIndexCtrl', function($scope, $state, MealsService) {
  $scope.$on('$ionicView.enter', function(e) {
    MealsService.getMeals().then(function(meals){
      $scope.meals = meals;
    })
  });

  $scope.selectMeal = function(id) {
    $state.go('tab.eat.mealDetail', { id: id });
  };
})



.controller('MealDetailCtrl', function($scope, $state, $stateParams, $ionicLoading, MealsService) {
  $scope.$on('$ionicView.enter', function(e) {
    MealsService.getMeal($stateParams.id).then(function(meal){
      $scope.meal = meal;
    });
  });

  $scope.joinMeal = function(){
    // erase history now
    MealsService.joinMeal($scope.meal.id);
    $state.go('tab.eat.eating', { id: $scope.meal.id });
  };
})



.controller('EatingCtrl', function($scope, $stateParams, $ionicModal, MealsService) {
  $scope.optionsForStatusChooser = ["Chilling out", 'On my way'];

  $scope.$on('$ionicView.enter', function(e) {
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

  $scope.doRefresh = function() {
    $scope.$broadcast('scroll.refreshComplete');
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



.controller('LoginCtrl', function($scope, $state) {
  $scope.login = function() {
    $state.go('tab.eat.mealsIndex');
    // $cordovaFacebook.login(["public_profile", "email", "user_friends"])
    // .then(function(success) {
      
    // }, function (error) {
    //   
    // });

  };
});
