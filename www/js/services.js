var Testing = {};


// Only for testing
// Will remove in future.
function feignRequestingDataFromNetwork($q, data) {
	var dfd = $q.defer()
	var networkDelayMS = 300;

	setTimeout(function() {
		dfd.resolve(data)
	}, networkDelayMS);

	return dfd.promise;
}



angular.module('flatcook.services', [])

.service('API', function($http) {
	var FLATCOOK_API_PREFIX = "https://flatcook.com";

	this.get = function(endpoint, params) {
		return flatcookAPI('GET', endpoint, params)
	}

	this.post = function(endpoint, params) {
		return flatcookAPI('POST', endpoint, params)
	}

	// endpoint is like /user/login
	// returns thing that can do .success(response) and .error(response)
	function flatcookAPI(method, endpoint, params) {
		return $http({
			method: method,
			url: FLATCOOK_API_PREFIX + endpoint,
			data: JSON.stringify(params),
	    	withCredentials: true,
	    	contentType: "application/json; charset=utf-8",
			dataType: "json",
		});
	}

})

.service('UI', function($ionicLoading) {

	this.showLoading = function($scope, text) {
		var scope = $scope.$new()

		scope.cancelLoading = function() {
			$ionicLoading.hide();
		}
		$ionicLoading.show({ template: '<button class="button button-clear" style="line-height: normal; min-height: 0; min-width: 0;" ng-click="cancelLoading()"><i class="ion-close-circled"></i></button> ' + text, scope: scope})
	}

	this.hideLoading = function() {
		$ionicLoading.hide()
	}

})

.factory('$localStorage', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    get: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
})

.factory('MealsService', function($http, $q, $localStorage, $rootScope) {
	var mealsService = {
		currentMealID: null,
		currentCookingMealID: null,


		VALID_CHEF_STATUSES: ['Waiting on guests', 'Cooking', 'Meal ready!'],
		VALID_GUEST_STATUSES: ['Chilling', 'On my way'],
		VALID_COOK_RATINGS: [
			{ text: 'Excellent', emoji: ['smile','smile','smile'] },
			{ text: 'Pretty good', emoji: ['content'] }, 
			{ text: 'Bad', emoji: ['disappointed'] }
		],
		VALID_HOW_WAS_MEAL: [
			''
		]
	};

	mealsService.loadState = function(state) {
		Object.assign(mealsService, $localStorage.get('MealsService'));
	}
	mealsService.loadState()

	mealsService.saveState = function() {
		var state = {
			currentMealID: mealsService.currentMealID,
			currentCookingMealID: mealsService.currentCookingMealID
		}
		$localStorage.set('MealsService', state);
	}

	mealsService.hookRealtimeEvents = function() {
		// maintain connection with server
		// TODO

		// on event
	}
	Testing.broadcastMealFinished = function() {
		$rootScope.$broadcast('MealsService.mealFinished', {
			mealID: 0
		})
	}

	Testing.setEatingMeal = function(id) {
		mealsService.currentMealID = id;
		mealsService.saveState();
	}
	Testing.setCookingMeal = function(id) {
		mealsService.currentCookingMealID = id;
		mealsService.saveState();
	}

	// currentPosition is documented at https://github.com/apache/cordova-plugin-geolocation
	mealsService.getMeals = function(user, currentPosition) {
		return feignRequestingDataFromNetwork($q, sampleData.meals);
	}

	mealsService.getMeal = function(mealID) {
		return feignRequestingDataFromNetwork($q, sampleData.meals[parseInt(mealID)]);
	}

	mealsService.joinMeal = function(mealID) {
		mealsService.currentMealID = mealID;
		mealsService.saveState();
		return feignRequestingDataFromNetwork($q, {
			status: 'success'
		});
	}

	mealsService.getGuestStatuses = function(mealID) {
		var guests = sampleData.meals[parseInt(mealID)].guests;
		return feignRequestingDataFromNetwork($q, guests);
	}

	mealsService.cancelAttending = function() {
		mealsService.currentMealID = null;
		mealsService.saveState();
		return feignRequestingDataFromNetwork($q, {
			status: 'success'
		});
	}

	mealsService.updateEatingStatus = function(status) {
		mealsService.saveState();
		return feignRequestingDataFromNetwork($q, {
			status: 'success'
		});
	}

	mealsService.updateCookingStatus = function(status) {
		mealsService.saveState();
		return feignRequestingDataFromNetwork($q, {
			status: 'success'
		});
	}

	mealsService.createMeal = function(mealData) {
		mealsService.currentCookingMealID = 0;
		// TODO
		mealsService.saveState();
		return feignRequestingDataFromNetwork($q, {
			status: 'success'
		});
	}

	mealsService.cancelCooking = function(mealID) {
		mealsService.currentCookingMealID = null;
		mealsService.saveState();
		return feignRequestingDataFromNetwork($q, {
			status: 'success'
		});
	}

	mealsService.serveMeal = function(mealID) {
		mealsService.saveState();
		return feignRequestingDataFromNetwork($q, {
			status: 'success'
		});
	}

	mealsService.postChefRating = function(ratingData) {
		mealsService.currentCookingMealID = null;
		mealsService.saveState();
		return feignRequestingDataFromNetwork($q, {
			status: 'success'
		});
	}

	// {howWasMeal: {rating: 4, description: "asdasdsd asdasd"}, wasEveryoneCool: {cool: false, description: "asdasdasd sad dasd", markedPeople: [82439823]}, mealID: 0}
	mealsService.postGuestRating = function(ratingData) {
		mealsService.currentMealID = null;
		mealsService.saveState();
		return feignRequestingDataFromNetwork($q, {
			status: 'success'
		});
	}

	return mealsService
})

.factory('UsersService', function($http, $q, $cordovaFacebook, $localStorage, $cookies, $ionicModal, StripeCheckout, API, UI) {
	var FACEBOOK_PERMISSIONS = ["public_profile", "email", "user_friends", "user_birthday"];
	var usersService = {
		loggedInUser: null,
		flatcookAPISessionKey: null,
		_facebookData: null
	};

	usersService.getCurrentUser = function() {
		return usersService.loggedInUser;
	}

	usersService.loadState = function(state) {
		Object.assign(usersService, $localStorage.get('UsersService'));
		if (IsServingBrowserFromIonicServe) {
			usersService.flatcookAPISessionKey = 'TESTING123';
			usersService.loggedInUser = sampleData.users[0];
		}
	}
	usersService.loadState()

	usersService.saveState = function() {
		var state = {
			loggedInUser: usersService.loggedInUser,
			flatcookAPISessionKey: usersService.flatcookAPISessionKey
		}
		$localStorage.set('UsersService', state);
	}

	usersService.authenticateWithFacebook = function() {
		// var dfd = $q.defer();
		// return dfd.promise
		return $cordovaFacebook.login(FACEBOOK_PERMISSIONS);
	}

	usersService.signOut = function() {
		usersService.loggedInUser = null
		usersService.flatcookAPISessionKey = null
		usersService._facebookData = null
		usersService.saveState()

		var dfd = $q.defer();
		dfd.resolve(true);
		return dfd.promise;
	}

	usersService.loginOrRegister = function(facebookData) {
		//authResponse
		// accessToken
		// userID

		var dfd = $q.defer();
		$cordovaFacebook.api('me?fields=email,name,friends', FACEBOOK_PERMISSIONS).then(function(data) {
			usersService.loggedInUser = register();

			function register() {
				var user = sampleData.users[0];
				user.name = data.name;
				user.email = data.email;
				user.facebookID = data.id;

				usersService._facebookData = facebookData; // debugging, who knows when we'll need it
				
    			var params = {
    				email: data.email,
    				facebookid: data.id,
    				oauth_token: facebookData.authResponse.accessToken,
					oauth_verifier: facebookData.authResponse.signedRequest,
					expires_in: facebookData.authResponse.expires_in,
					username: data.name
    			}
    			
    			API.post('/user/login', params)
				.success(function(response){
			  		// The response i get back comes with a set-cookie (check the console>network tab)
			    	// Now i have the user id and am logged in, but i want to verify that im logged in for 
			    	// good so i call the user endpoint - it uses the session cookie to retrieve user data
			    	user.id = response;
			    	
			    	API.get('/user', {})
					.success(function(data){
				  		//If this comes back success then all the user data we have in the backend should be in this response.
				  		//curently only a few fields but easily scalable
				    	user.id = data;
				  	}).error(function(){
				    	alert("error");
				  	});
			  	}).error(function(){
			    	alert("error");
			  	});

				return user;
			}

			dfd.resolve(true);
		}, function (error) {
			console.error(error)
    	});


		subscribeToUserNotifications();

		function subscribeToUserNotifications() {}

		return dfd.promise;
	}

	usersService.getUser = function(userID) {
		if (userID == usersService.loggedInUser.id) {
			return usersService.loggedInUser; // TODO
		} else {
			
		}
	}

	usersService.getHistory = function() {
		return feignRequestingDataFromNetwork($q, sampleData.users[0].mealHistory);
	}

	// Non-API mappings.
	usersService.userNeedsToLinkPaymentMethod = function() {
		return !usersService.getCurrentUser().paymentInfo.paymentMethodLinked;
	}

	usersService.userNeedsToLinkBankAccount = function() {
		return !usersService.getCurrentUser().paymentInfo.bankAccountDetails.linked;
	}

	usersService.linkBankAccount = function(accountData) {
		// bsb, accountNumber
		var info = usersService.loggedInUser.paymentInfo.bankAccountDetails
		info.linked = true
		info.bsb = accountData.bsb
		info.accountNumber = accountData.accountNumber
		// TODO
	}

	usersService.linkPaymentMethod = function(stripeData) {
		var info = usersService.loggedInUser.paymentInfo
		info.paymentMethodLinked = true
		// TODO
	}

	usersService.showPaymentLinkDialog = function() {
		var dfd = $q.defer();

		var handlerOptions = {
	        name: 'Flatcook',
	        description: 'Eating together',
	    	  amount:      "0.00",
			  currency:    "aud",
			  email:       usersService.getCurrentUser().email,
			  key:         "pk_test_6pRNASCoBOKtIshFeQd4XMUh",
			  panelLabel:  "Link account",
	    };

		var handler = StripeCheckout.configure({})

	    handler.open(handlerOptions).then(function success(stripeData) {
	    	usersService.linkPaymentMethod(stripeData)
	    	dfd.resolve()

	    }, function closedWithoutLinking() {
	    	dfd.reject()
	    });

	    return dfd.promise;
	}

	usersService.showLinkBankAccountDialog = function($scope) {
		$ionicModal.fromTemplateUrl('templates/partials/linkBankAccountDialog.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.linkBankAccountDialog = modal;
			$scope.linkBankAccountDialog.show()
			$scope.hideBankAccountDialog = function() {
				$scope.linkBankAccountDialog.hide();
			}
		});
	}

	return usersService;
})

.factory('LocationService', function($q) {
	var geolocationOptions = {
		maximumAge: 3000,
		timeout: 3000,
		enableHighAccuracy: true
	}

	var locationService = {};
	locationService.getCurrentPosition = function(success, failure) {
		if(IsServingBrowserFromIonicServe) {
			var testPosition = void(0); // TODO

			setTimeout(success.bind(testPosition), 300); 
		} else {
			navigator.geolocation.getCurrentPosition(success, failure, geolocationOptions);
		}
	}

	// locationService.showMap = function(address, latlng) {
	// 	console.log('asdad')
	// 	function launchDirections(address) {
	// 	window.location.href = "maps://maps.apple.com/?daddr=" + address;
	// 	}	

		
	// 	// var address=data.street+", "+data.city+", "+data.state;
	// 	var url='';
	// 	if(/*device.platform==='iOS'||device.platform==='iPhone'||*/navigator.userAgent.match(/(iPhone|iPod|iPad)/)){
	// 		url="http://maps.apple.com/maps?q="+encodeURIComponent(address);
	// 	}else if(navigator.userAgent.match(/(Android|BlackBerry|IEMobile)/)){
	// 		url="geo:?q="+encodeURIComponent(address);
	// 	}else{
	// 		//this will be used for browsers if we ever want to convert to a website
	// 		url="http://maps.google.com?q="+encodeURIComponent(address);
	// 	}
	// 	window.open(url, "_system", 'location=no');
	// }

	return locationService;
})