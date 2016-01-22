controllers.controller('EatingCtrl', function($scope, $state, $stateParams, $ionicModal, $ionicPopup, $ionicHistory, MealsService, LocationService) {
	// Initial $scope vars
	// -------------------
	$scope._eatingStatusChooser = {
		options: MealsService.VALID_GUEST_STATUSES
	}

	// On enter
	// --------
	$scope.$on('$ionicView.enter', function(e) {
		loadMeal()
	});

	$scope.$on('MealsService.mealFinished', function() {
		$state.go('rating.guests.step1');
	})

	// Modals and functions
	// --------------------
	$ionicModal.fromTemplateUrl('templates/partials/eatingStatusChooserModal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.eatingStatusChooser = modal;
	});

	function loadMeal() {
		MealsService.getMeal(MealsService.currentMealID).then(function(meal) {
			$scope.meal = meal;
			var numChefs = 1;
			if($scope.meal.eatingStatus == null) {
				$scope.meal.eatingStatus = MealsService.VALID_GUEST_STATUSES[0];
			}
			$scope.meal.numberOfGuestsInWords = numberInWords(numChefs + meal.guests.length);
			$scope.meal.servedAtFormatted = moment(meal.servedAt).format('h:mma') // 5pm
		})
	}

	// Scope functions
	// ---------------
	$scope.doRefresh = function() {
		loadMeal()
		$scope.$broadcast('scroll.refreshComplete');
	}

	
	// $scope.showMap = function() {
	// 	LocationService.showMap($scope.meal.address, $scope.meal.latlng);
	// }

	$scope.chooseEatingStatus = function() {
		$scope.eatingStatusChooser.show()
	}
	$scope.closeEatingStatusChooser = function(){
		$scope.eatingStatusChooser.hide()
		MealsService.updateEatingStatus($scope.meal.cookingStatus)
	}

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



.controller('CookingCtrl', function($scope, $stateParams, $ionicModal, $ionicPopup, $ionicHistory, $state, MealsService) {
	// Initial $scope vars
	// -------------------
	$scope.time = 0;
	$scope._cookingStatusChooser = {
		options: MealsService.VALID_CHEF_STATUSES
	}

	// On enter
	// --------
	$scope.$on('$ionicView.enter', function(e) {
		loadMeal()
	});

	// Modals and functions
	// --------------------	
	$ionicModal.fromTemplateUrl('templates/partials/cookingStatusChooserModal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.cookingStatusChooser = modal;
	});

	function loadMeal() {
		MealsService.getMeal(MealsService.currentCookingMealID).then(function(meal) {
			$scope.meal = meal;
			var numChefs = 1;
			$scope.meal.totalProfit = meal.price * meal.guests.length;
			$scope.meal.cookingStatus = $scope.meal.cookingStatus || MealsService.VALID_CHEF_STATUSES[0];
			$scope.meal.numberOfGuestsInWords = numberInWords(numChefs + meal.guests.length);
			$scope.meal.servedAtFormatted = moment(meal.servedAt).format('h:mma') // 5:30pm

			$scope.meal.timeTillServe_seconds = Math.round(moment.duration($scope.meal.servedAt.diff(moment())).asSeconds())
			$scope.$broadcast('timer-set-countdown', $scope.meal.timeTillServe_seconds)
		})
	}

	// Scope functions
	// ---------------
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

	$scope.doRefresh = function() {
		loadMeal()
		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.finishMeal = function() {
		// TODO
		$state.go('rating.chefs.step1');
	}

	$scope.chooseCookingStatus = function() {
		$scope.cookingStatusChooser.show()
	}
	$scope.closeCookingStatusChooser = function(){
		$scope.cookingStatusChooser.hide()
		MealsService.updateCookingStatus($scope.meal.cookingStatus)
	}

	$scope.confirmCancelMeal = function() {
		var confirmPopup = $ionicPopup.confirm({
			title: 'Confirm Cancel Meal',
			template: 'Do you really want to cancel on your guests?'
		});
		confirmPopup.then(function(yes) {
			if (yes) {
				MealsService.cancelCooking();
				$ionicHistory.nextViewOptions({ disableBack: true });
				$state.go('tab.cook.newMeal.intro');
			}
		});
	}

	$scope.$on('$destroy', function() {
		$scope.cookingStatusChooser.remove();
	});
})

.controller('ChefRatingCtrl', function($scope, $state, $ionicModal, MealsService) {
	// Initial $scope vars
	// -------------------
	$scope.rating = {
		experience: null,
		description: null,
		people: []
	}
	$scope.experienceOptions = MealsService.VALID_COOK_RATINGS;

	// On enter
	// --------
	$scope.$on('$ionicView.enter', function(e) {
		loadMeal()
	});

	// Modals and functions
	// --------------------
	function loadMeal() {
		MealsService.getMeal(MealsService.currentMealID).then(function(meal) {
			$scope.meal = meal;
			$scope.meal.people = meal.guests.map(function(guest){ return { name: guest.name, marked: false, id: guest.id } });
			$scope.rating.date = meal.servedAt;
			$scope.rating.peopleInvolved = humanizeArray(meal.guests.map(function(guest){ return guest.name.split(' ')[0] }));

			if(IsServingBrowserFromIonicServe) {
				$scope.rating.experience = $scope.rating.experience || 'Bad';
				$scope.rating.date = moment().subtract(4, 'h');
			}
		})
	}
	
	// Scope functions
	// ---------------
	$scope.chooseExperience = function() {
		$state.go('rating.chefs.step2');
	}

	$scope.send = function() {
		var rating = {
			mealID: MealsService.currentMealID,

			experience: $scope.rating.experience,
			description: $scope.rating.description,
			markedPeople: $scope.meal.people.map(function(person){ if(person.marked) { return person.id; } }).filter(function(val){ return val !== undefined })
		}
		MealsService.postChefRating(rating)
		$state.go('tab.cook.newMeal.intro')
	}
})


.controller('GuestRatingCtrl', function($scope, $state, MealsService){
	// Initial $scope vars
	// -------------------
	$scope.rating = {
		howWasMeal: {
			rating: null,
			description: null
		},
		wasEveryoneCool: {
			cool: null,
			description: '',
			people: null
		}
	}
	

	// On enter
	// --------
	$scope.$on('$ionicView.enter', function(e) {
		loadMeal()
	});

	// Modals and functions
	// --------------------
	function loadMeal() {
		MealsService.getMeal(MealsService.currentMealID).then(function(meal) {
			$scope.meal = meal;
			$scope.rating.date = meal.servedAt;

			$scope.rating.wasEveryoneCool.people = meal.guests.map(function(guest){ return { name: guest.name, marked: false, id: guest.id } });
			
			if(IsServingBrowserFromIonicServe) {
				$scope.rating.date = moment().subtract(4, 'h');
			}
		})
	}
	
	// Scope functions
	// ---------------
	$scope.rate = function() {
		if($scope.rating.howWasMeal.rating >= 4) {
			$scope.rateExperience();
		}
	}

	$scope.rateExperience = function() {
		$state.go('rating.guests.step2');
	}

	$scope.send = function() {
		var rating = {
			howWasMeal: {
				rating: $scope.rating.howWasMeal.rating,
				description: $scope.rating.howWasMeal.description
			},
			wasEveryoneCool: {
				cool: $scope.rating.wasEveryoneCool.cool,
				description: $scope.rating.wasEveryoneCool.description,
				markedPeople: $scope.rating.wasEveryoneCool.people.map(function(person){ if(person.marked) { return person.id; } }).filter(function(val){ return val !== undefined })
			},
			mealID: MealsService.currentMealID,
		}
		MealsService.postGuestRating(rating)
		$state.go('tab.eat.mealsIndex')
	}
})




//
// Controller template
//

/*
.controller('', function(){
	// Initial $scope vars
	// -------------------

	// On enter
	// --------

	// Modals and functions
	// --------------------	
	
	// Scope functions
	// ---------------
})
*/