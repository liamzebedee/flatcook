function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

function sanitizeKeyboardInput(element, pattern) {
	element.bind('keypress', function(e){
		var char = String.fromCharCode(e.which||e.charCode||e.keyCode);
		if(!(pattern.test(char))) {
			event.preventDefault();
		}
	});
}



angular.module('flatcook.directives', [])

.directive('inputMoney', function() {
    return {
    	require: '?ngModel',
        restrict: 'A',

        link: function(scope, element, attrs, ngModel) {
        	sanitizeKeyboardInput(element, (/[0-9\.]/) );

              ngModel.$formatters.push(function(value) {
              	// return '$'+roundToTwo(value);
              	return roundToTwo(value);
			  });

			  //format text from the user (view to model)
			  ngModel.$parsers.push(function(value) {
			  	// var newVal = roundToTwo(value.replace('$', ''));
			  	var newVal = roundToTwo(value);
              	return newVal;
			  });
        }
    };
})

.directive('inputNumberInt', function() {
    return {
    	require: '?ngModel',
        restrict: 'A',

        link: function(scope, element, attrs, ngModel) {
        	sanitizeKeyboardInput(element, /\d/);

              ngModel.$formatters.push(function(value) {
              	return parseInt(value);
			  });

			  //format text from the user (view to model)
			  ngModel.$parsers.push(function(value) {
			  	return parseInt(value);
			  });
        }
    };
});
