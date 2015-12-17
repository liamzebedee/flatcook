angular.module('flatcook.controllers', ['ngCordova', 'flatcook.services', 'flatcook.directives'])


.controller('TabsController', function($scope, $state) {})


.controller('MealsIndexCtrl', function($scope, $state, MealsService, UsersService, LocationService) {
	$scope.loadingMeals = false;
	$scope.lastUpdated = new Date();
	$scope.errorLoadingMeals = null;

	$scope.$on('$ionicView.loaded', function(){
		$scope.user = UsersService.loggedInUser;
		$scope.doRefresh();
	})
	$scope.$on('$ionicView.beforeEnter', function(e) {
		$scope.user = UsersService.loggedInUser;
		$scope.doRefresh();
	});

	$scope.selectMeal = function(id) {
		$state.go('tab.eat.mealDetail', {
			id: id
		});
	};

	$scope.doRefresh = function() {
		$scope.loadingMeals = true;

		var position = LocationService.getCurrentPosition(
			function(position) {
				$scope.errorLoadingMeals = "";
				// Finding meals near you
				MealsService.getMeals(UsersService.usersService, position).then(function(meals) {
					$scope.errorLoadingMeals = null;
					$scope.meals = meals;
					$scope.loadingMeals = false;
					$scope.lastUpdated = new Date();
					$scope.$broadcast('scroll.refreshComplete');
				});
			},

			function(error) {
				$scope.loadingMeals = false;
				$scope.$broadcast('scroll.refreshComplete');
				$scope.errorLoadingMeals = "couldn't get location"
			}
		);

	};
})



.controller('MealDetailCtrl', function($scope, $state, $stateParams, $ionicLoading, $ionicPopup,
	MealsService, UsersService) {

	$scope.$on('$ionicView.beforeEnter', function(e) {
		MealsService.getMeal($stateParams.id).then(function(meal) {
			$scope.meal = meal;
		});
	});

	$scope.doRefresh = function() {
		MealsService.getMeal($stateParams.id).then(function(meal) {
			$scope.meal = meal;
			$scope.$broadcast('scroll.refreshComplete');
		});
	}

	$scope.joinMeal = function() {
		var confirmPopup = $ionicPopup.confirm({
			title: 'Confirm Join Meal',
			template: 'Are you sure you can commit to coming?'
		});
		confirmPopup.then(function(yes) {
			if (yes) {
				if (UsersService.userNeedsToLinkPaymentMethod()) {
					// show link payment method dialog
					// wait on auth
				}

				MealsService.joinMeal($scope.meal.id);
				$ionicHistory.nextViewOptions({
			    	disableBack: true
			    });
				$state.go('tab.eat.eating');
			} else {

			}
		});
	};
})



.controller('EatingCtrl', function($scope, $stateParams, $ionicModal, MealsService) {
	$scope.optionsForStatusChooser = ["Chilling out", 'On my way'];

	$scope.doRefresh = function() {
		$scope.$broadcast('scroll.refreshComplete');
	}

	$ionicModal.fromTemplateUrl('/templates/partials/statusChooserModal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.statusChooserModal = modal;
	});

	$scope.$on('$ionicView.enter', function(e) {
		MealsService.getMeal(MealsService.currentMealID).then(function(meal) {
			$scope.meal = meal;
			$scope.meal.numberOfGuestsInWords = numberInWords($scope.meal.guests.length);
			$scope.meal.userStatus = $scope.optionsForStatusChooser[0];
		})
	});

	$scope.openStatusChooser = function() {
		$scope.statusChooserModal.show();
	};

	$scope.closeStatusChooser = function() {
		$scope.statusChooserModal.hide();
	};

	$scope.$on('$destroy', function() {
		$scope.statusChooserModal.remove();
	});
})



.controller('NewMealCtrl', function($scope, $state, $ionicPopup, $ionicHistory, MealsService) {
	$scope.formData = {
		description: "",

		numberOfMeals: 0,
		costPerMeal: 0.0,
		totalCost: 0.0,

		whenServed: null,
		location: ""
	};

	$scope.step1 = {
		wordsLeft: 20,
		maxLengthOfDescription: 120
	}

	$scope.step2 = {}

	$scope.startForm = function() {
		$scope.formData = {};
		$state.go('tab.cook.newMeal.step1')
	};
	$scope.navToStep2 = function() {

		$state.go('tab.cook.newMeal.step2');
	}
	$scope.navToStep3 = function() {

		$state.go('tab.cook.newMeal.step3');
	}
	$scope.submitForm = function() {
		var confirmPopup = $ionicPopup.confirm({
			title: 'Confirm Post Meal',
			template: 'Ready to cook?'
		});
		confirmPopup.then(function(yes) {
			if (yes) {
				MealsService.createMeal($scope.formData).then(function(){
					$ionicHistory.nextViewOptions({
				    	disableBack: true
				    });
					$state.go('tab.cook');
				}, function(){
					// something went wrong
				});
			}
		});
	}

	$scope.$watch('formData.numberOfMeals', recalcTotalCost);
	$scope.$watch('formData.costPerMeal', recalcTotalCost);
	$scope.$watch('formData.totalCost', recalcCostPerMeal);

	function recalcCostPerMeal(newVal, oldVal) {
		if (newVal == oldVal) return;
		$scope.formData.costPerMeal = ($scope.formData.totalCost / $scope.formData.numberOfMeals) || 0;
	}

	function recalcTotalCost(newVal, oldVal) {
		if (newVal == oldVal) return;
		$scope.formData.totalCost = ($scope.formData.costPerMeal * $scope.formData.numberOfMeals) || 0;
	}

	$scope.$on('$ionicView.enter', function(e) {
		recalcTotalCost();
	});
})



.controller('CookingCtrl', function($scope) {
	$scope.$on('$ionicView.enter', function(e) {});
})



.controller('ProfileCtrl', function($scope, $state, UsersService) {
	$scope.$on('$ionicView.beforeEnter', function(e) {
		$scope.user = UsersService.loggedInUser;
	});

	$scope.signOut = function() {
		UsersService.signOut().then(function() {
			$state.go('login');
		});
	};

	$scope.configurePaymentMethod = function() {
		throw new Error("Not Impl");
	};
})



.controller('LoginCtrl', function($scope, $state, $ionicLoading, UsersService) {
	$scope.loginAsTesting = function() {
		if (IsServingBrowserFromIonicServe) {
			$state.go('tab.eat.mealsIndex');
		}
	};

	$scope.login = function() {
		try {
			$ionicLoading.show({
				template: 'Signing in with FB...'
			});

			UsersService.authenticateWithFacebook().then(function(facebookData) {
				$ionicLoading.show({
					template: 'Creating your profile...'
				});

				UsersService.loginOrRegister(facebookData).then(function(success) {
					if (success) {
						$ionicLoading.hide();
						$state.go('tab.eat.mealsIndex');
					}
				});

			}, function(err) {});

		} catch (ex) {
			throw ex;
		}
	};
});