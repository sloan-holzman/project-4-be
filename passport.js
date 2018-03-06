// authentication approach borrowed heavily from  https://medium.com/@robince885/how-to-do-twitter-authentication-with-react-and-restful-api-e525f30c62bb

const passport = require('passport')
const TwitterTokenStrategy = require('passport-twitter-token')
const mongoose = require("./db/schema.js")
const User = mongoose.User;
var twitterConsumerKey
var twitterConsumerSecret
var twitterConfig
if (process.env.NODE_ENV == "production") {
  twitterConsumerKey = process.env.CONSUMER_KEY
  twitterConsumerSecret = process.env.CONSUMER_SECRET
} else {
  twitterConfig = require('./twitter.config.js')
  twitterConsumerKey = twitterConfig.consumerKey
  twitterConsumerSecret = twitterConfig.consumerSecret
}

module.exports = function () {

  passport.use(new TwitterTokenStrategy({
      consumerKey: twitterConsumerKey,
      consumerSecret: twitterConsumerSecret,
      includeEmail: true
    },
    function (token, tokenSecret, profile, done) {
      checkLogIn(token, tokenSecret, profile, function(err, user) {
        return done(err, user);
      });
    }));

};

// 4. based on the profile id, checks if user is already saved in DB.   If not already in the system, create one.  Either way, pass user to callback function (which is specified as the "done" function above)
function checkLogIn (token, tokenSecret, profile, cb) {
  return User.findOne({
    'twitterProvider.id': profile.id
  }, function(err, user) {
    if (!user) {
      var newUser = new User({
        email: profile.emails[0].value,
        twitterProvider: {
          id: profile.id,
          token: token,
          tokenSecret: tokenSecret
        }
      });

      newUser.save(function(error, savedUser) {
        if (error) {
          console.log(error);
        }
        return cb(error, savedUser);
      });
    } else {
      return cb(err, user);
    }
  });
};
