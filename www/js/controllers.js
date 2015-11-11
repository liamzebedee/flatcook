


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




.controller('MealDetailCtrl', function($scope, $state, $stateParams, MealsService) {
  $scope.$on('$ionicView.enter', function(e) {
    $scope.meal = MealsService.getMeal($stateParams.id);
  });

  $scope.joinMeal = function(){
    // erase history now
    $state.go('tab.eat.eating', { id: $scope.meal.id });
  };
})



.controller('EatingCtrl', function($scope, $stateParams, $ionicModal, MealsService) {
  $scope.optionsForStatusChooser = ["Chilling out", 'On my way'];

  $scope.$on('$ionicView.enter', function(e) {
    $scope.meal = MealsService.getMeal(0);
    $scope.meal.numberOfGuestsInWords = numberInWords($scope.meal.guests.length);
    $scope.meal.userStatus = $scope.optionsForStatusChooser[0];

    $ionicModal.fromTemplateUrl('/templates/partials/statusChooserModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.statusChooserModal = modal;
    });
  });

  $scope.openStatusChooserModal = function(){
    $scope.statusChooserModal.show();
  };

  $scope.closeStatusChooserModal = function() {
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

.controller('LoginCtrl', function($scope, $state) {
  $scope.login = function() {
    $state.go('tab.eat.mealsIndex');
  };
});
