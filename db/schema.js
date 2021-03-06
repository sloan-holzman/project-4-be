const mongoose = require('./connection')

// Retailer is just the names of all the possible retailers and the URLs to where you can check gift card balances for each retailer
const RetailerSchema = new mongoose.Schema({
	name: String,
	cardSite: String
})

const CardSchema = new mongoose.Schema({
	type: String,
	number: String,
	retailer: String,
  expiration: Date,
  amount: String,
	pin: String,
  updated: { type: Date, default: Date.now },
	// url where user can check gift card's balance
	cardHtml: String
})

var UserSchema = new mongoose.Schema({
  email: {
    type: String, required: true,
    trim: true, unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  twitterProvider: {
    type: {
      id: String,
      token: String
    },
		// when queried, twitterProvider info is not included unless specifically requested
    select: false
  },
  cards: [CardSchema]
});

// don't this is actually necessary.  just ensures user is saved as a json and that we can use getters and virtuals if we want
UserSchema.set('toJSON', {getters: true, virtuals: true});



const User = mongoose.model('User', UserSchema)
const Card = mongoose.model('Card', CardSchema)
const Retailer = mongoose.model('Retailer', RetailerSchema)


module.exports = {
  User,
  Card,
	Retailer
}
