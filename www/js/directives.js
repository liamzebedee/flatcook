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

.filter('dateAsDaysAgo', function (amTimeAgoFilter, angularMomentConfig) {
  function dateAsDaysAgoFilter(value) {
    return amTimeAgoFilter(value);
          // var val = amTimeAgoFilter(amLocalFilter(amEndOfFilter(value, 'day')));
          // if(/hours|minutes|seconds/.test(val)) {
          //   return ''; // TODO HACK
          // } else {
          //   return val;
          // }
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

.directive('xcountdown', function($window, $interval) {

  var dateTypes = [
  'year',
  'month',
  'day',
  'hour',
  'minute',
  'second',
  'millisecond'
  ];

  function getDuration (time) {
    var diff = $window.moment(time).diff();
    return $window.moment.duration(diff);
  }

  function getDurationObject (time) {
    var duration = getDuration(time);
    // var durationObject = {};

    // angular.forEach(dateTypes, function (type) {
    //   var typeVal = duration[type + 's'](); // pluralise
    //   if (typeVal) {
    //     durationObject[type] = typeVal;
    //   }
    // });

    return duration;
  }

return {
  restrict: 'EAC',
  replace: false,
  scope: {
    countdown: "=",
    interval: "=",
    active: "=",
    onZeroCallback: "=",
    duration: '='
  },
  template:"{{formatted}}",

  link: function ($scope, el, $attrs) {
    var self = this;
    
    var queueTick = function () {
      $scope.timer = $interval(function () {
        if ($scope.countdown > 0) {
          $scope.countdown -= 1;
          $scope.moment = getDurationObject(moment.duration($attrs.duration, 's'))

          if ($scope.countdown > 0) {
            queueTick();
          } else {
            $scope.countdown = 0;
            $scope.active = false;
            if (!_.isUndefined($scope.onZeroCallback)) {
              $scope.onZeroCallback();
            }
          }
        }
      }, $scope.interval || 1000);
    };

    if ($scope.active) {
      queueTick();
    }

    $scope.$watch('active', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        if (newValue === true) {
          if ($scope.countdown > 0) {
            queueTick();
          } else {
            $scope.active = false;
          }
        } else {
          $timeout.cancel($scope.timer);
        }
      }
    });
    $scope.$watch('countdown', function () {
      updateFormatted();
    });

    var updateFormatted = function () {
      $scope.formatted = $scope.moment.seconds()
    };
    updateFormatted();


    $scope.$on('$destroy', function () {
      $interval.cancel($scope.timer);
    });

  }
};
})



