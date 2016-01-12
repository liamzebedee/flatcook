controllers.controller('EatingCtrl', function($scope, $state, $stateParams, $ionicModal, $ionicPopup, $ionicHistory, MealsService) {
	$scope.doRefresh = function() {
		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.chooseEatingStatus = function() {
		$scope.eatingStatusChooser.show()
	}
	$scope.closeEatingStatusChooser = function(){
		$scope.eatingStatusChooser.hide()
		MealsService.updateStatus($scope.meal.eatingStatus)
	}
	$scope._eatingStatusChooser = {
		options: MealsService.VALID_GUEST_STATUSES
	}

	$ionicModal.fromTemplateUrl('templates/partials/statusChooserModal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.eatingStatusChooser = modal;
	});


	$scope.showPersonDetail = function(person) {
		$scope.personDetail = person;

		$ionicModal.fromTemplateUrl('templates/partials/personInfoDialog.html', {
			scope: $scope,
			animation: 'slide-in-up',
			backdropClickToClose: true
		}).then(function(modal) {
			$scope.personInfoDialog = modal;
			$scope.personInfoDialog.show();
		});
	}

	$scope.hidePersonDetail = function() {
		$scope.personInfoDialog.hide()
	}
	

	$scope.$on('$ionicView.enter', function(e) {
		MealsService.getMeal(MealsService.currentMealID).then(function(meal) {
			$scope.meal = meal;
			var numChefs = 1;
			$scope.meal.eatingStatus = $scope.meal.eatingStatus || MealsService.VALID_GUEST_STATUSES[0];
			$scope.meal.numberOfGuestsInWords = numberInWords(numChefs + meal.guests.length);
			$scope.meal.servedAtFormatted = moment(meal.servedAt).format('h:mma') // 5pm
		})
	});

	$scope.confirmCancelMeal = function() {
		var confirmPopup = $ionicPopup.confirm({
			title: 'Confirm Cancel Meal',
			template: 'Do you really want to cancel on your host and others?'
		});
		confirmPopup.then(function(yes) {
			if (yes) {
				MealsService.cancelAttending();
				$ionicHistory.nextViewOptions({ disableBack: true });
				$state.go('tab.eat.mealsIndex');
			}
		});
	}

	$scope.$on('$destroy', function() {
		$scope.guestStatusChooserModal.remove();
	});
})



.controller('CookingCtrl', function($scope, $stateParams, $ionicModal, MealsService) {
	$scope.meal = { servedAtDuration_ms:  0} ;
	$scope.time = 0;

	$scope.$on('$ionicView.enter', function(e) {
		MealsService.getMeal(MealsService.currentMealID).then(function(meal) {
			$scope.meal = meal;
			var numChefs = 1;
			// $scope.meal.eatingStatus = $scope.meal.eatingStatus || MealsService.VALID_GUEST_STATUSES[0];
			$scope.meal.numberOfGuestsInWords = numberInWords(numChefs + meal.guests.length);
			$scope.meal.servedAtFormatted = moment(meal.servedAt).format('h:mma') // 5:30pm

			$scope.meal.timeTillServe_seconds = Math.round(moment.duration($scope.meal.servedAt.diff(moment())).asSeconds())
			$scope.$broadcast('timer-set-countdown', $scope.meal.timeTillServe_seconds)
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
