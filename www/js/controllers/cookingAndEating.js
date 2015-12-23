controllers.controller('EatingCtrl', function($scope, $stateParams, $ionicModal, MealsService) {
	$scope.guestStatusChooser = {
		options: MealsService.VALID_GUEST_STATUSES
	};

	$scope.doRefresh = function() {
		$scope.$broadcast('scroll.refreshComplete');
	}

	$ionicModal.fromTemplateUrl('/templates/partials/guestRatingModal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.guestStatusChooserModal = modal;
	});

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



.controller('CookingCtrl', function($scope, $state, $ionicModal, MealsService) {
	$scope.chefStatusChooser = {
		options: MealsService.VALID_CHEF_STATUSES
	}

	$ionicModal.fromTemplateUrl('/templates/partials/statusChooserModal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.chefStatusChooserModal = modal;
	});

	$ionicModal.fromTemplateUrl('/templates/partials/chefRatingModal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.ratingModal = modal;
	});

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
