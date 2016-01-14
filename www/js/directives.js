function roundToTwo(num) {
  return +(Math.round(num + "e+2") + "e-2");
}

function sanitizeKeyboardInput(element, pattern) {
  element.bind('keypress', function(e) {
    var char = String.fromCharCode(e.which || e.charCode || e.keyCode);
    if (!(pattern.test(char))) {
      event.preventDefault();
    }
  });
}



angular.module('flatcook.directives', ['angularMoment'])

.filter('dateAsDaysAgo', function (amTimeAgoFilter, amLocalFilter, amEndOfFilter, angularMomentConfig) {
  function dateAsDaysAgoFilter(value) {
    // return amTimeAgoFilter(value);
          var val = amTimeAgoFilter(amLocalFilter(amEndOfFilter(value, 'day')));
          if(/hours|minutes|seconds/.test(val)) {
            return ''; // TODO HACK
          } else {
            return val;
          }
        }

        dateAsDaysAgoFilter.$stateful = angularMomentConfig.statefulFilters;

        return dateAsDaysAgoFilter;
})


.directive('inputMoney', function() {
  return {
    require: '?ngModel',
    restrict: 'A',

    link: function(scope, element, attrs, ngModel) {
      sanitizeKeyboardInput(element, (/[0-9\.]/));

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

.directive( "emoji", function () {
  var EMOJIIS = {
          smile: '1F603',
          ecstatic: '1F606',
          content: '1F60A',
          disappointed: '1F61E'
        }
  var EMOJIIS_HTML = {};
  for(var emojiiName in EMOJIIS) {
    EMOJIIS_HTML[emojiiName] = '&#x'+EMOJIIS[emojiiName]+';';
  }

    return {
      restrict: "E",
      link: function ( scope, element, attributes ) {
        return element.replaceWith(EMOJIIS_HTML[attributes.name]);
      }
    }
  });



