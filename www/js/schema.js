// This is for data that we want rigorously defined.
// Rather than JS screwing us over with its loosy-goosy typing.


var User = schema({
	id: Number,
	name: String,
	email: String,

	paymentInfo: {
		// ... 
		// TODO tonight after meeting
	}, // will be null when it's not the own user's data

	tagline: String,
	address: String,
	location: Array.of(2, Number),
	avatarUrl: String,

	cookRating: [String, null],
	friendlinessRating: String,

	mealHistory: Array.of(Meal),

	currentMealID: [Number, null],
	currentCookingMealID: [Number, null]
})

var Guest = schema(User.extend({
	eatingStatus: [String, null]
}))

var Chef = schema(User.extend({
	cookingStatus: [String, null]
}))

var Meal = schema({
	id: Number,
	name: String,
	price: Number.min(0).max(100),
	servedAt: moment(),
	image: String,
	location: Array.of(2, Number),
	address: String,

	chef: Chef,

	guests: Array.of(Guest),
})