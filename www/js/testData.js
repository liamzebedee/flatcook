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
		email: 'test.user@example.com',

		paymentInfo: {
			balanceReadyForTransfer: 20.4,
			paymentMethodLinked: false,
			bankAccountDetails: {
				linked: true,
				bsb: 231321,
				accountNumber: 9847534334
			}
		},
		
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