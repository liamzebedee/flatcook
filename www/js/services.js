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
	        friendlinessRating: 'Excellent'
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
	          friendlinessRating: 'Excellent'
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
	        friendlinessRating: 'Excellent'
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
	          friendlinessRating: 'Excellent'
	        }
	      ]
	    }
	  ],



	  users: [
	    {
	      id: 0,
	      name: "Liam",
	      facebookID: 123123123,
	      balance: 0.0,
	      paymentID: "13212dcadsf3rfqr3",
	      address: "",
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
	mealsService = {
		currentMealID: null
	};

	// currentPosition is documented at https://github.com/apache/cordova-plugin-geolocation
	mealsService.getMeals = function(user, currentPosition) {
		console.log(currentPosition);
		return feignRequestingDataFromNetwork($q, sampleData.meals);
	}

	mealsService.getMeal = function(mealID) {
		return feignRequestingDataFromNetwork($q, sampleData.meals[parseInt(mealID)]);
	}

	mealsService.joinMeal = function(mealID) {
		mealsService.currentMealID = mealID;
	}

	mealsService.getGuestStatuses = function(mealID) {

	}

	mealsService.cancelAttending = function(mealID) {

	}

	mealsService.updateStatus = function(mealID) {

	}

	mealsService.createMeal = function(mealData) {

	}

	mealsService.cancelCooking = function(mealID) {

	}

	mealsService.serveMeal = function(mealID) {

	}

	return mealsService
})

.factory('UsersService', function($http, $q, $cordovaFacebook) {
	var usersService = {
		loggedInUser: null
	};

	usersService.login = function() {
		
		// function register(userData) {
		// 	// POST to http://api.flatcook.com/1.0/registerAndLogin with access_token
		// 	// they then use access_token to get user details if don't exist
		// 	// return the user object
		// 	var response = {};
		// 	if(response.error) {
		// 		throw new Error(error); // TODO
		// 	} else {

		// 	}
		// }
		// function subscribeToUserNotifications() {
		// }

		// $cordovaFacebook.login(["public_profile", "email", "user_friends"])
	 //    .then(function(success) {
	 //    	// post register to server
	 //    	usersService.loggedInUser = register();
	 //    	subscribeToUserNotifications();

	 //    }, function (error) {
		// 	throw new Error(error); // TODO
	 //    });
		
		return feignRequestingDataFromNetwork($q, sampleData.users[0]);
	}

	usersService.getUser = function(userID) {
		if(userID == usersService.loggedInUser.id) {
			return usersService.loggedInUser; // TODO
		} else {
			// GET http://api.flatcook.com/v1.0/user/{id}
			throw new Error("Not Impl");
		}
	}

	usersService.postRating = function(ratingData) {

	}


	// Non-API mappings.
	usersService.userNeedsToLinkPaymentMethod = function() {
		return userService.loggedInUser.paymentID == null;
	}



	return usersService;
});