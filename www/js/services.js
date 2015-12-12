VALID_CHEF_STATUSES = ['Waiting on guests', 'Cooking', 'Meal ready!'];
VALID_GUEST_STATUSES = ['Chilling', 'On my way'];

VALID_FRIENDLINESS_RATINGS = ['Excellent'];
VALID_COOK_RATINGS = ['Excellent'];

sampleData = {
	meals: [
	    {
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

	        status: VALID_CHEF_STATUSES[1]
	      },
	      guests: [
	        {
	          id: 0,
	          name: "Liam",
	          facebookID: 123123123,
	          balance: 0.0,
	          paymentID: "13212dcadsf3rfqr3",
	          address: "",
	          avatarUrl: 'http://ionicframework.com/img/docs/venkman.jpg',
	          cookRating: 'N/A',
	          friendlinessRating: 'Excellent',

	          status: VALID_GUEST_STATUSES[1]

	        }
	      ]
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

	        status: VALID_CHEF_STATUSES[1]
	      },
	      guests: [
	        {
	          id: 0,
	          name: "Liam",
	          facebookID: 123123123,
	          balance: 0.0,
	          paymentID: "13212dcadsf3rfqr3",
	          address: "",
	          avatarUrl: 'http://ionicframework.com/img/docs/venkman.jpg',
	          cookRating: 'N/A',
	          friendlinessRating: 'Excellent',

	          status: VALID_GUEST_STATUSES[1]
	        }
	      ]
	    }
	  ],

	  users: [
	    {
	      id: 0,
	      name: "Test User",
	      facebookID: 123123123,
	      
	      balance: 10.0,
	      paymentID: "13212dcadsf3rfqr3",

	      address: "", // where the meal is hosted
	      lastLocation: [],
	      avatarUrl: 'http://ionicframework.com/img/docs/venkman.jpg',

	      cookRating: 'N/A',
	      friendlinessRating: 'Excellent'
	    }
	  ]
};

// Only for testing
// Will remove in future.
function feignRequestingDataFromNetwork($q, data) {
	var dfd = $q.defer()
	var networkDelayMS = 100;

	setTimeout(function(){
		dfd.resolve(data)
	}, networkDelayMS);

	return dfd.promise;
}

angular.module('flatcook.services', [])

.factory('MealsService', function($http, $q) {	
	var mealsService = {
		currentMealID: null
	};

	// currentPosition is documented at https://github.com/apache/cordova-plugin-geolocation
	mealsService.getMeals = function(user, currentPosition) {
		return feignRequestingDataFromNetwork($q, sampleData.meals);
	}

	mealsService.getMeal = function(mealID) {
		return feignRequestingDataFromNetwork($q, sampleData.meals[parseInt(mealID)]);
	}

	mealsService.joinMeal = function(mealID) {
		mealsService.currentMealID = mealID;
		return feignRequestingDataFromNetwork($q, { status: 'success' });
	}

	mealsService.getGuestStatuses = function(mealID) {
		var guests = sampleData.meals[parseInt(mealID)].guests;
		return feignRequestingDataFromNetwork($q, guests);
	}

	mealsService.cancelAttending = function(mealID) {
		mealsService.currentMealID = null;
		return feignRequestingDataFromNetwork($q, { status: 'success' });
	}

	mealsService.updateStatus = function(mealID) {
		return feignRequestingDataFromNetwork($q, { status: 'success' });
	}

	mealsService.createMeal = function(mealData) {
		return feignRequestingDataFromNetwork($q, { status: 'success' });
	}

	mealsService.cancelCooking = function(mealID) {
		return feignRequestingDataFromNetwork($q, { status: 'success' });
	}

	mealsService.serveMeal = function(mealID) {
		return feignRequestingDataFromNetwork($q, { status: 'success' });
	}

	return mealsService
})

.factory('UsersService', function($http, $q, $cordovaFacebook) {
	var FACEBOOK_PERMISSIONS = ["public_profile", "email", "user_friends"];
	var usersService = {
		loggedInUser: null,
		flatcookAPISessionKey: null,
		_facebookData: null
	};

	if(IsServingBrowserFromIonicServe) {
		usersService.loggedInUser = sampleData.users[0];
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
    	$cordovaFacebook.api('me?fields=email,name,friends', FACEBOOK_PERMISSIONS).then(function(data){
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
    	});


		subscribeToUserNotifications();
		function subscribeToUserNotifications() {
		}
		
		return dfd.promise;
	}

	usersService.getUser = function(userID) {
		if(userID == usersService.loggedInUser.id) {
			return usersService.loggedInUser; // TODO
		} else {
			 $.getJSON('http://localhost:52509/user/id/' + userID)
                .success(function (response) {
                    return response.user;
                });
		}
	}

	usersService.postRating = function(ratingData) {
		return feignRequestingDataFromNetwork($q, { status: 'success' });
	}

	// Non-API mappings.
	usersService.userNeedsToLinkPaymentMethod = function() {
		return usersService.loggedInUser.paymentID == null;
	}

	return usersService;
});