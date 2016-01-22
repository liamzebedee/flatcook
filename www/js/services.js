sampleData = {
	meals: [{
			id: 0,
			name: 'Spaghetti Bolognaise',
			price: 5.50,
			servedAt: moment().add(4, 'h'),
			image: 'img/example-spagbol.jpg',
			location: [12.42141, 21.231231],
			address: "Gumal 501",

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
				tagline: 'Never spends a day without cooking!',
				numberOfMeals: 5,

				cookingStatus: 'Cooking!'
			},
			guests: [{
				id: 82439823,
				name: "Liam",
				facebookID: 123123123,
				balance: 0.0,
				paymentID: "13212dcadsf3rfqr3",
				address: "",
				avatarUrl: 'http://ionicframework.com/img/docs/venkman.jpg',
				cookRating: 'N/A',
				friendlinessRating: 'Excellent',
				numberOfMeals: 3,

				eatingStatus: 'On my way!'
			}, 
			{
				id: 12321312,
				name: "Bobby Testing",
				facebookID: 312341231,

				balance: 15.0,
				paymentID: "21j9d898ahdhs",

				address: "", // where the meal is hosted
				lastLocation: [],
				avatarUrl: 'http://ionicframework.com/img/docs/venkman.jpg',

				eatingStatus: 'On my way!',

				cookRating: 'N/A',
				friendlinessRating: 'Excellent',
				numberOfMeals: 1,

				mealHistory: [
					{
						date: moment().subtract(14, 'd'),
						name: 'Spaghetti',
						cost: 7.5,
						location: '203',
						hostDisplayPicUrl: 'http://ionicframework.com/img/docs/venkman.jpg',
						guestNames: ['Georgia', 'John', 'David']
					}
				]
			}],

			userStatus: ''
		},

		{
			id: 1,
			name: 'Pizza',
			price: 4.10,
			servedAt: moment().add(36, 'h'),
			image: 'img/example-pizza.jpeg',
			cook: {
				id: 0,
				name: "Liam",
				facebookID: 123123123,
				balance: 0.0,
				paymentInfo: { id: "13212dcadsf3rfqr3" },
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
				paymentInfo: { id: "35121cadsf3rfqr3" },
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
		paymentInfo: { id: "13212dcadsf3rfqr3" },
		
		tagline: 'Never spends a day without cooking!',

		address: "", // where the meal is hosted
		lastLocation: [],
		avatarUrl: 'http://ionicframework.com/img/docs/venkman.jpg',

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
	},
	{
		id: 1,
		name: "Bobby Testing",
		facebookID: 312341231,

		balance: 15.0,
		paymentInfo: { id: "543212dcadsf3rfqr3" },

		address: "", // where the meal is hosted
		lastLocation: [],
		avatarUrl: 'http://ionicframework.com/img/docs/venkman.jpg',

		cookRating: 'N/A',
		friendlinessRating: 'Excellent',

		mealHistory: [
			{
				date: moment().subtract(14, 'd'),
				name: 'Spaghetti',
				cost: 7.5,
				location: '203',
				hostDisplayPicUrl: 'http://ionicframework.com/img/docs/venkman.jpg',
				guestNames: ['Georgia', 'John', 'David']
			}
		]
	}],
};

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

.factory('UsersService', function($http, $q, $cordovaFacebook, $localStorage, $cookies, $ionicModal) {
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
		// Object.assign(usersService, $localStorage.get('UsersService'));
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
				
				//Liam - here is the walkthrough for validation. Use these two calls as a model for other service calls as well
				//First i set up the parameters and turn it into json data - only needed for POSTS
    			var params = new Object();
				params.email = data.email;
				params.facebookid = data.id;
				params.oauth_token = facebookData.authResponse.accessToken;
				params.oauth_verifier = facebookData.authResponse.signedRequest;
				params.expires_in = facebookData.authResponse.expires_in;
				params.username = data.name;
				var jsonData = JSON.stringify(params);

				//Next i post my login token to the user login endpoint
				$http({
			        method: 'POST',
			        url: 'http://localhost:50001/user/login',
			        data: jsonData,
			        withCredentials: true,
			        contentType: "application/json; charset=utf-8",
            		dataType: "json",
			  	}).success(function(response){
			  		//The response i get back comes with a set-cookie (check the console>network tab)
			    	//Now i have the user id and am logged in, but i want to verify that im logged in for 
			    	//good so i call the user endpoint - it uses the session cookie to retrieve user data
			    	user.id = response;
				  	$http({
				        method: 'GET',
				        url: 'http://localhost:50001/user',
				        contentType: "application/json; charset=utf-8",
				   		withCredentials: true,
	            		dataType: "json",
				  	}).success(function(data){
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
			$.getJSON('http://localhost:52509/user/id/' + userID)
				.success(function(response) {
					// return response.user;
				});
		}
	}

	usersService.getHistory = function() {
		return feignRequestingDataFromNetwork($q, sampleData.users[0].mealHistory);
	}

	// Non-API mappings.
	usersService.userNeedsToLinkPaymentMethod = function() {
		return usersService.loggedInUser.paymentInfo !== null;
	}

	usersService.showPaymentLinkDialog = function($scope) {
		function showDialog() {
			$ionicModal.fromTemplateUrl('templates/partials/paymentDialog.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				modal.show()
			});
		}
		if(IsServingBrowserFromIonicServe) {
			var TEST_FAILURE = false;
			var dfd = $q.defer()
			
			setTimeout(function() {
				if(TEST_FAILURE) {
					dfd.reject()
				} else {
					showDialog()
					dfd.resolve()
				}
			}, 2000);

			return dfd.promise;
		}
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

	locationService.showMap = function(address, latlng) {
		console.log('asdad')
		function launchDirections(address) {
		window.location.href = "maps://maps.apple.com/?daddr=" + address;
		}	

		
		// var address=data.street+", "+data.city+", "+data.state;
		var url='';
		if(/*device.platform==='iOS'||device.platform==='iPhone'||*/navigator.userAgent.match(/(iPhone|iPod|iPad)/)){
			url="http://maps.apple.com/maps?q="+encodeURIComponent(address);
		}else if(navigator.userAgent.match(/(Android|BlackBerry|IEMobile)/)){
			url="geo:?q="+encodeURIComponent(address);
		}else{
			//this will be used for browsers if we ever want to convert to a website
			url="http://maps.google.com?q="+encodeURIComponent(address);
		}
		window.open(url, "_system", 'location=no');
	}

	return locationService;
})