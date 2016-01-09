sampleData = {
	meals: [{
			id: 0,
			name: 'Spaghetti Bolognaise',
			price: 5.50,
			servedAt: "5pm",
			image: 'img/example-spagbol.jpg',
			chef: {
				id: 0,
				name: "Liam",
				facebookID: 123123123,
				balance: 0.0,
				paymentID: "13212dcadsf3rfqr3",
				address: "",
				avatarUrl: 'http://ionicframework.com/img/docs/venkman.jpg',
				cookRating: 'Excellent',
				friendlinessRating: 'Excellent',

				cookingStatus: ''
			},
			guests: [{
				id: 0,
				name: "Liam",
				facebookID: 123123123,
				balance: 0.0,
				paymentID: "13212dcadsf3rfqr3",
				address: "",
				avatarUrl: 'http://ionicframework.com/img/docs/venkman.jpg',
				cookRating: 'N/A',
				friendlinessRating: 'Excellent',

				eatingStatus: ''
			}],

			userStatus: ''
		},

		{
			id: 1,
			name: 'Pizza',
			price: 4.10,
			servedAt: "10pm",
			image: 'img/example-pizza.jpeg',
			cook: {
				id: 0,
				name: "Liam",
				facebookID: 123123123,
				balance: 0.0,
				paymentID: "13212dcadsf3rfqr3",
				address: "",
				avatarUrl: 'http://ionicframework.com/img/docs/venkman.jpg',
				cookRating: 'Excellent',
				friendlinessRating: 'Excellent',

				cookingStatus: ''
			},
			guests: [{
				id: 0,
				name: "Liam",
				facebookID: 123123123,
				balance: 0.0,
				paymentID: "13212dcadsf3rfqr3",
				address: "",
				avatarUrl: 'http://ionicframework.com/img/docs/venkman.jpg',
				cookRating: 'N/A',
				friendlinessRating: 'Excellent',

				eatingStatus: ''
			}],

			userStatus: ''
		}
	],

	users: [{
		id: 0,
		name: "Test User",
		facebookID: 123123123,

		balance: 10.0,
		paymentID: "13212dcadsf3rfqr3",

		address: "", // where the meal is hosted
		lastLocation: [],
		displayPicUrl: 'http://ionicframework.com/img/docs/venkman.jpg',

		cookRating: 'N/A',
		friendlinessRating: 'Excellent',

		mealHistory: [
			{
				date: moment().subtract(2, 'd'),
				name: 'Pizza',
				cost: 7.5,
				location: '501',
				hostDisplayPicUrl: 'http://ionicframework.com/img/docs/venkman.jpg',
				guestNames: ['Bobby', 'Dave', 'Patrice']
			}
		]
	}],
};

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

.factory('MealsService', function($http, $q, $localStorage) {
	var mealsService = {
		currentMealID: 0,
		currentlyCooking: false,

		VALID_CHEF_STATUSES: ['Waiting on guests', 'Cooking', 'Meal ready!'],
		VALID_GUEST_STATUSES: ['Chilling', 'On my way'],
		VALID_COOK_RATINGS: ['Excellent', 'Pretty good', 'Bad']
	};

	mealsService.loadState = function(state) {
		Object.assign(mealsService, $localStorage.get('MealsService'));
	}
	mealsService.loadState()

	mealsService.saveState = function() {
		var state = {
			currentMealID: mealsService.currentMealID,
			currentlyCooking: mealsService.currentlyCooking
		}
		$localStorage.set('MealsService', state);
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

	mealsService.cancelAttending = function(mealID) {
		mealsService.currentMealID = null;
		mealsService.saveState();
		return feignRequestingDataFromNetwork($q, {
			status: 'success'
		});
	}

	mealsService.updateStatus = function(mealID) {
		mealsService.saveState();
		return feignRequestingDataFromNetwork($q, {
			status: 'success'
		});
	}

	mealsService.createMeal = function(mealData) {
		mealsService.currentlyCooking = true;
		mealsService.saveState();
		return feignRequestingDataFromNetwork($q, {
			status: 'success'
		});
	}

	mealsService.cancelCooking = function(mealID) {
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

	return mealsService
})

.factory('UsersService', function($http, $q, $cordovaFacebook, $localStorage) {
	var FACEBOOK_PERMISSIONS = ["public_profile", "email", "user_friends"];
	var usersService = {
		loggedInUser: null,
		flatcookAPISessionKey: null,
		_facebookData: null
	};

	if (IsServingBrowserFromIonicServe) {
		usersService.flatcookAPISessionKey = 'TESTING123';
		usersService.loggedInUser = sampleData.users[0];
	}

	usersService.loadState = function(state) {
		Object.assign(usersService, $localStorage.get('UsersService'));
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
		return $cordovaFacebook.login(FACEBOOK_PERMISSIONS);
	}

	usersService.signOut = function() {
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
			$.getJSON('http://localhost:52509/user/id/' + userID)
				.success(function(response) {
					// return response.user;
				});
		}
	}

	usersService.postRating = function(ratingData) {
		return feignRequestingDataFromNetwork($q, {
			status: 'success'
		});
	}

	usersService.getHistory = function() {
		return feignRequestingDataFromNetwork($q, sampleData.users[0].mealHistory);
	}

	// Non-API mappings.
	usersService.userNeedsToLinkPaymentMethod = function() {
		return usersService.loggedInUser.paymentID == null;
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

	return locationService;
})