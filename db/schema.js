const mongoose = require('./connection')


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
  }
});

UserSchema.set('toJSON', {getters: true, virtuals: true});

const User = mongoose.model('User', UserSchema)


module.exports = mongoose
