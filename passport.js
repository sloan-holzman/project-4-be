'use strict';

const passport = require('passport')
const TwitterTokenStrategy = require('passport-twitter-token')
const mongoose = require("./db/schema.js")
const User = mongoose.model("User")
const twitterConfig = require('./twitter.config.js');

module.exports = function () {

  passport.use(new TwitterTokenStrategy({
      consumerKey: twitterConfig.consumerKey,
      consumerSecret: twitterConfig.consumerSecret,
      includeEmail: true
    },
    function (token, tokenSecret, profile, done) {
      checkLogIn(token, tokenSecret, profile, function(err, user) {
        return done(err, user);
      });
    }));

};

function checkLogIn (token, tokenSecret, profile, cb) {
  return this.findOne({
    'twitterProvider.id': profile.id
  }, function(err, user) {
    // no user was found, lets create a new one
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
