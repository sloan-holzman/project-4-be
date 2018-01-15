const mongoose = require('./connection')


const RetailerSchema = new mongoose.Schema({
	name: String,
	cardSite: String
})

const CardSchema = new mongoose.Schema({
	number: String,
	retailer: String,
  expiration: Date,
  balance: Number,
	pin: String,
  updated: { type: Date, default: Date.now }
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
    select: false
  },
  cards: [CardSchema]
});

UserSchema.set('toJSON', {getters: true, virtuals: true});



const User = mongoose.model('User', UserSchema)
const Card = mongoose.model('Card', CardSchema)
const Retailer = mongoose.model('Retailer', RetailerSchema)


module.exports = {
  User,
  Card,
	Retailer
}
