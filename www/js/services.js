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
	        stripeID: "13212dcadsf3rfqr3",
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
	          stripeID: "13212dcadsf3rfqr3",
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
	        stripeID: "13212dcadsf3rfqr3",
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
	          stripeID: "13212dcadsf3rfqr3",
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
	      stripeID: "13212dcadsf3rfqr3",
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

	mealsService.getMeals = function(userID, currentLocation) {
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

.factory('UsersService', function($http) {
	var loggedInUser = null;

	var usersService = {};

	usersService.login = function() {

	}

	usersService.getUser = function(userID) {

	}

	usersService.postRating = function(ratingData) {

	}

	return usersService;
});