const mongoose = require('./connection')


const CardSchema = new mongoose.Schema({
	number: String,
	retailer: String,
  expiration: Date,
  balance: Number,
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
const Card = mongoose.model('Card', UserSchema)

module.exports = {
  User,
  Card
}
