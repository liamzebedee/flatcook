var numbersAsWords = ['','one','two','three','four', 'five','six','seven','eight','nine','ten'];
function numberInWords(num) {
  return numbersAsWords[num];
}

var meals = [
    {
      id: 0,
      name: 'Spaghetti Bolognaise',
      price: 5.50,
      servedAt: "5pm",
      image: 'img/example-spagbol.jpg',
      chef: {
        name: "Liam",
        location: "Gumal 501",
        avatarUrl: 'http://ionicframework.com/img/docs/venkman.jpg'
      },
      guests: [
        {
          id: 0,
          name: "Liam",
          fbid: 123123123,
          stripeToken: "13212dcadsf3rfqr3",
          location: "",
          avatarUrl: 'http://ionicframework.com/img/docs/venkman.jpg'
        },
        {
          id: 0,
          name: "Liam",
          fbid: 123123123,
          stripeToken: "13212dcadsf3rfqr3",
          location: "",
          avatarUrl: 'http://ionicframework.com/img/docs/venkman.jpg'
        },
        {
          id: 0,
          name: "Liam",
          fbid: 123123123,
          stripeToken: "13212dcadsf3rfqr3",
          location: "",
          avatarUrl: 'http://ionicframework.com/img/docs/venkman.jpg'
        }
      ]
    },
    {
      id: 1,
      name: 'Pizza',
      price: 4.10,
      servedAt: "10pm",
      image: 'img/example-pizza.jpeg',
      chef: {
        name: "Liam",
        location: "Gumal 207",
        avatarUrl: 'http://ionicframework.com/img/docs/venkman.jpg'
      },
      guests: ['Dave', 'Sofe']
    }
  ];

var users = [
  {
    id: 0,
    name: "Liam",
    fbid: 123123123,
    stripeToken: "13212dcadsf3rfqr3",
    location: "",
    avatarUrl: 'http://ionicframework.com/img/docs/venkman.jpg'
  },
  {
    id: 1,
    name: "Liam",
    fbid: 123123123,
    stripeToken: "13212dcadsf3rfqr3",
    location: "",
    avatarUrl: 'http://ionicframework.com/img/docs/venkman.jpg'
  },
  {
    id: 2,
    name: "Liam",
    fbid: 123123123,
    stripeToken: "13212dcadsf3rfqr3",
    location: "",
    avatarUrl: 'http://ionicframework.com/img/docs/venkman.jpg'
  },
];


angular.module('starter.controllers', [])

.controller('MealsIndexCtrl', function($scope, $state) {
  $scope.meals = meals;

  $scope.selectMeal = function(id) {
    $state.go('tab.eat.mealDetail', { id: id });
  };
})

.controller('MealDetailCtrl', function($scope, $state, $stateParams) {
  $scope.meal = meals[$stateParams.id];

  $scope.joinMeal = function(){
    // erase history now
    $state.go('tab.eat.eating', { id: $scope.meal.id });
  };
})

.controller('EatingCtrl', function($scope, $stateParams, $ionicModal) {
  $scope.meal = meals[0];
  $scope.meal.numberOfGuestsInWords = numberInWords($scope.meal.guests.length);


  $ionicModal.fromTemplateUrl('/templates/partials/statusChooserModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.statusChooserModal = modal
  });

  $scope.openStatusChooserModal = function(){
    $scope.statusChooserModal.show();
  };

  $scope.closeStatusChooserModal = function() {
    $scope.statusChooserModal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.statusChooserModal.remove();
  });
})

.controller('NewMealCtrl', function($scope) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
})

.controller('ProfileCtrl', function($scope, $state) {
  $scope.signOut = function(){
    $state.go('login');
  };
})

.controller('LoginCtrl', function($scope, $state) {
  $scope.login = function() {
    $state.go('tab.eat.mealsIndex');
  };
});
