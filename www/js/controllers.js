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
      guests: ['Nick', 'Alec', 'Cristina']
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
];


angular.module('starter.controllers', [])

.controller('EatCtrl', function($scope, $state) {
  $scope.meals = meals;

  $scope.selectMeal = function(id) {
    $state.go('tab.eat.detail', { id: id });
  };
})

.controller('EatDetailCtrl', function($scope, $state, $stateParams) {
  $scope.meal = meals[$stateParams.id];

  $scope.joinMeal = function(){
    $state.go('tab.eat.eating', { id: $stateParams.id });
  };
})

.controller('EatingCtrl', function($scope, $stateParams) {
  $scope.meal = meals[$stateParams.id];
})

.controller('LoginWelcomeCtrl', function($scope, $state) {
  $scope.login = function() {
    $state.go('tab.eat.index');
  };

})

.controller('CookCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ProfileCtrl', function($scope, $state) {
  $scope.signOut = function(){
    $state.go('loginWelcome');
  };
});
