controllers.controller('EatingCtrl', function($scope, $stateParams, $ionicModal, MealsService) {
	$scope.doRefresh = function() {
		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.$on('$ionicView.enter', function(e) {
		MealsService.getMeal(MealsService.currentMealID).then(function(meal) {
			$scope.meal = meal;
			$scope.meal.numberOfGuestsInWords = numberInWords($scope.meal.guests.length);
			$scope.meal.userStatus = $scope.guestStatusChooser.options[0];
		})
	});

	$scope.openStatusChooser = function() {
		$scope.guestStatusChooserModal.show();
	};

	$scope.closeStatusChooser = function() {
		$scope.guestStatusChooserModal.hide();
	};

	$scope.$on('$destroy', function() {
		$scope.guestStatusChooserModal.remove();
	});
})



.controller('CookingCtrl', function($scope, $stateParams, $ionicModal, MealsService) {
	$scope.$on('$ionicView.enter', function(e) {
		MealsService.getMeal(MealsService.currentMealID).then(function(meal) {
			$scope.meal = meal;
			$scope.meal.numberOfGuestsInWords = numberInWords($scope.meal.guests.length);
			$scope.meal.userStatus = $scope.chefStatusChooser.options[0];
		})
	});

	$scope.doRefresh = function() {
		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.finishMeal = function() {
		$scope.ratingModal.show();
	}

	$scope.openStatusChooser = function() {
		$scope.chefStatusChooserModal.show();
	};

	$scope.closeStatusChooser = function() {
		$scope.meal.chef.cookingStatus = $scope.chefStatusChooser.status;
		$scope.chefStatusChooserModal.hide();
	};

	$scope.$on('$destroy', function() {
		$scope.chefStatusChooserModal.remove();
	});
})

.controller('ChefRatingCtrl', function($scope, $state, $ionicModal, MealsService) {
	$scope.rating = {
		meal: $scope.meal,
		date: yesterday(),
		peopleInvolved: humanizeArray(['Dave', 'John', 'Jessie']),
		experience: MealsService.VALID_COOK_RATINGS[0]
	}
	$scope.experienceOptions = MealsService.VALID_COOK_RATINGS;


	$scope.chooseExperience = function() {
		$state.go('rating.chefs.step2');
	}

	$scope.chooseRating = function() {
		$scope.experienceChooser.show();
	}

	$scope.closeOnSelect = function() {
		$scope.experienceChooser.hide()
	}
})
