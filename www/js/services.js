angular.module('flatcook.services', [])

.factory('MealsService', function($http) {
	var meals = [];

	return {
		getMeals: function() {
			return $http.jsonp("js/sampleData.json?callback=JSON_CALLBACK").then(function(response) {
		    	meals = response.data.meals;
		    	return meals;
		    });
		},

		getMeal: function(id) {
			
			return meals[parseInt(id)];
			// return $http.jsonp("js/sampleData.json?callback=JSON_CALLBACK").then(function(response) {
		 //    	meals = response.data.meals;
		 //    	return meals[parseInt(id)];
		 //    });
		},
	};
})

.factory('UsersService', function($http) {
	var users = [];

	return {
		
	};
});