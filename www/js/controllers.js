var controllers = angular.module('flatcook.controllers', ['ngCordova', 'flatcook.services', 'flatcook.directives']);

controllers.controller('AppController', function($scope, $state) {
	// load data from storage (localStorage, SQLite DB)
	// important state:
	// - currently cooking
	// - currently eating
})

.controller('TabsController', function($scope, $state, MealsService, $ionicHistory, $ionicTabsDelegate) {
	$scope.navigatedAlready = {
		eat: false,
		cook: false,
		profile: false
	}
		$scope.navdEat = false;
	$scope.navdCook = false;
	$scope.navdProfile = false;

	// function doNav(tabName, ) {
	// 	if(!$scope.navigatedAlready[tabName]) {
	// 		$ionicHistory.nextViewOptions({ disableBack: true, disableAnimate: true, historyRoot: false })

	// 	}
	// }

	$scope.navEat = function(){
		
		if(!$scope.navdEat) {

            var newState = '';

            if(MealsService.currentMealID != null) {
              newState = 'tab.eat.eating'
            } else {
              newState = 'tab.eat.mealsIndex'
            }

          // $ionicTabsDelegate.select(0)
            $state.go(newState);

            $scope.navdEat = true;
		}
	}
	$scope.navCook = function(){

		if(!$scope.navdCook) {
			$ionicHistory.nextViewOptions({ disableBack: true, disableAnimate: true, historyRoot: false })

          var newState = '';

		if(MealsService.currentCookingMealID != null) {
            newState = 'tab.cook.cooking'
          } else {
            newState = 'tab.cook.newMeal.intro'
          }
          $state.go(newState);

            $scope.navdCook = true;
        }
	}
	$scope.navProfile = function(){

		if(!$scope.navdProfile) {
			$ionicHistory.nextViewOptions({ disableBack: true, disableAnimate: true, historyRoot: false })

          var newState = '';

			newState = 'tab.profile.main'
          $state.go(newState);

            $scope.navdProfile = true;
        }
	}
})

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



.controller('MealDetailCtrl', function($scope, $state, $stateParams, $ionicLoading, $ionicPopup, $ionicHistory, MealsService, UsersService) {

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
				$ionicHistory.nextViewOptions({ disableBack: true });
				$state.go('tab.eat.eating');
			} else {

			}
		});
	};
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
					// TODO
					$ionicHistory.nextViewOptions({
				    	disableBack: true
				    });
					$state.go('tab.cook.cooking');
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

.controller('RatingCtrl', function($scope) {
})


.controller('ProfileCtrl', function($scope, $state, UsersService) {
	$scope.$on('$ionicView.beforeEnter', function(e) {
		$scope.user = UsersService.loggedInUser;
	});

	$scope.doRefresh = function() {
		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.signOut = function() {
		UsersService.signOut().then(function() {
			$state.go('login');
		});
	};

	$scope.openHistory = function() {
		$state.go('tab.profile.history');
	}

	$scope.openPaymentDetails = function() {
		throw new Error("Not Impl");
	};
})

.controller('ProfileHistoryCtrl', function($scope, UsersService) {
	$scope.humanizeArray = humanizeArray;

	$scope.$on('$ionicView.beforeEnter', function(e) {
		UsersService.getHistory().then(function(history){
			$scope.mealHistory = history;
		})
	});
})



.controller('LoginCtrl', function($scope, $state, $ionicLoading, UsersService) {
	$scope.agreedToTCs = false;

	$scope.loginAsTesting = function() {
		if (IsServingBrowserFromIonicServe) {
			UsersService.saveState()
			$state.go('tab.eat.mealsIndex');
		}
	}

	$scope.cancelLoading = function() {
		$ionicLoading.hide();
	}

	function createCancelLoading(text) {
		$ionicLoading.show({ template: '<button class="button button-clear" style="line-height: normal; min-height: 0; min-width: 0;" ng-click="cancelLoading()"><i class="ion-close-circled"></i></button> ' + text, scope: $scope})
	}

	$scope.login = function() {
		try {
			createCancelLoading('Signing in with FB...')

			UsersService.authenticateWithFacebook().then(function(facebookData) {
				createCancelLoading('Creating your profile...')

				UsersService.loginOrRegister(facebookData).then(function(success) {
					if (success) {
						$scope.cancelLoading()
						$state.go('tab.eat.mealsIndex');
					} else {
						$scope.cancelLoading()
					}
				});

			}, function(err) {
				$scope.cancelLoading()
			});

		} catch (ex) {
			throw ex;
		}
	};
	
});