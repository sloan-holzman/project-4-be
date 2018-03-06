// authentication approach borrowed heavily from https://medium.com/@robince885/how-to-do-twitter-authentication-with-react-and-restful-api-e525f30c62bb

const passport = require('passport')
const expressJwt = require('express-jwt')
const cors = require('cors')
const mongoose = require("../db/schema.js")
const User = mongoose.User;
const Card = mongoose.Card;
const Retailer = mongoose.Retailer;
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const bodyParser = require('body-parser')
const request = require('request')
const passportConfig = require('../passport');
var twitterConsumerKey
var twitterConsumerSecret
var twitterOauthCallBack
var twitterSecret
var twitterConfig
if (process.env.NODE_ENV == "production") {
  twitterConsumerKey = process.env.CONSUMER_KEY
  twitterConsumerSecret = process.env.CONSUMER_SECRET
  twitterOauthCallBack = process.env.OAUTH_CALLBACK
  twitterSecret = process.env.SECRET
} else {
  twitterConfig = require('../twitter.config.js')
  twitterConsumerKey = twitterConfig.consumerKey
  twitterConsumerSecret = twitterConfig.consumerSecret
  twitterOauthCallBack = twitterConfig.oauth_callback
  twitterSecret = twitterConfig.secret
}


module.exports = function(app){

  var corsOption = {
    // note to self: need to whitelist origins.  right now it is open to all
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
  };
  app.use(cors(corsOption));

  // tells the system whether you want to use a simple algorithm for shallow parsing (i.e. false) or complex algorithm for deep parsing that can deal with nested objects (i.e. true).
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());


  // 5a. user jwt to create a unique token based on the user id and on the twitter secret that expired in 2 hours
  var createToken = function(auth) {
    return jwt.sign({
      id: auth.id
    }, twitterSecret,
    {
      expiresIn: 60 * 120
    });
  };

  // 5. create a token based on the User's DB ID
  var generateToken = function (req, res, next) {
    req.token = createToken(req.auth);
    return next();
  };


  // 6. set the x-auth-token header to the token and send back the user details, along with the header, to the front end
  var sendToken = function (req, res) {
    Retailer.find({}, function(err, foundRetailers) {
      res.setHeader('x-auth-token', req.token);
      if (err) {
        res.send(500, 'err')
      } else {
        res.status(200).json({user: req.user, retailers: foundRetailers})
      }
    })
  }

  // 1. receive initial sign in request from frontend
  app.post("/api/v1/auth/twitter/reverse", function(req, res) {
      // ask for request token from twitter
      request.post({
        url: 'https://api.twitter.com/oauth/request_token',
        oauth: {
          oauth_callback: twitterOauthCallBack,
          consumer_key: twitterConsumerKey,
          consumer_secret: twitterConsumerSecret
        }
      }, function (err, r, body) {
        if (err) {
          return res.send(500, { message: e.message });
        }
        //  response is not formated as JSON object. transform it to JSON object
        var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        // send it back to the client that has requested request_token.
        res.send(JSON.parse(jsonStr));
      });
    });

    // 2. after user has logged in to twitter and received verification code (oath_verifier)
    app.post("/api/v1/auth/twitter", function(req, res, next) {
      // send request to twitter to get oauth_token and oauth_token_secret
      request.post({
        url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
        oauth: {
          consumer_key: twitterConsumerKey,
          consumer_secret: twitterConsumerSecret,
          token: req.query.oauth_token
        },
        form: { oauth_verifier: req.query.oauth_verifier }
      }, function (err, r, body) {
        if (err) {
          return res.send(500, { message: err.message });
        }

        const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        const parsedBody = JSON.parse(bodyString);

        // oauth_token and oauth_token_secret are added to request and sent to passport middleware
        req.body['oauth_token'] = parsedBody.oauth_token;
        req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
        req.body['user_id'] = parsedBody.user_id;

        next();
      });
      // 3. gets user information from twitter
    }, passport.authenticate('twitter-token', {session: false}), function(req, res, next) {
        if (!req.user) {
          return res.send(401, 'User Not Authenticated');
        }

        // prepare token for API
        req.auth = {
          id: req.user.id
        };

        return next();
      }, generateToken, sendToken);

}
