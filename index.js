'use strict';

//mongoose file must be loaded before all other files in order to provide
// models to other modules
const mongoose = require("./db/schema.js")
const User = require("./db/schema").User;
const Card = require("./db/schema").Card;
const passport = require('passport')
const express = require('express')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const request = require('request')
const twitterConfig = require('./twitter.config.js')
var passportConfig = require('./passport');

passportConfig();


// enable cors
var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


app.get("/api/v1/health-check", (req, res) => {
  res.send("hello world!");
});


var createToken = function(auth) {
  return jwt.sign({
    id: auth.id
  }, 'my-secret',
  {
    expiresIn: 60 * 120
  });
};

var generateToken = function (req, res, next) {
  req.token = createToken(req.auth);
  return next();
};

var sendToken = function (req, res) {
  res.setHeader('x-auth-token', req.token);
  return res.status(200).send(JSON.stringify(req.user));
};

app.post("/api/v1/auth/twitter/reverse", function(req, res) {
    request.post({
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        oauth_callback: twitterConfig.oauth_callback,
        consumer_key: twitterConfig.consumerKey,
        consumer_secret: twitterConfig.consumerSecret
      }
    }, function (err, r, body) {
      if (err) {
        return res.send(500, { message: e.message });
      }

      var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      res.send(JSON.parse(jsonStr));
    });
  });

  app.post("/api/v1/auth/twitter", function(req, res, next) {
    request.post({
      url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
      oauth: {
        consumer_key: twitterConfig.consumerKey,
        consumer_secret: twitterConfig.consumerSecret,
        token: req.query.oauth_token
      },
      form: { oauth_verifier: req.query.oauth_verifier }
    }, function (err, r, body) {
      if (err) {
        return res.send(500, { message: err.message });
      }

      const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      const parsedBody = JSON.parse(bodyString);

      req.body['oauth_token'] = parsedBody.oauth_token;
      req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
      req.body['user_id'] = parsedBody.user_id;

      next();
    });
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

//token handling middleware
var authenticate = expressJwt({
  secret: 'my-secret',
  requestProperty: 'auth',
  getToken: function(req) {
    if (req.headers['x-auth-token']) {
      return req.headers['x-auth-token'];
    }
    return null;
  }
});

var getCurrentUser = function(req, res, next) {
  User.findById(req.auth.id, function(err, user) {
    if (err) {
      next(err);
    } else {
      req.user = user;
      next();
    }
  });
};

var getOne = function (req, res) {
  var user = req.user.toObject();

  delete user['twitterProvider'];
  delete user['__v'];

  res.json(user);
};

app.get("/api/v1/auth/me", (req, res) => {
  (authenticate, getCurrentUser, getOne)
});


// app.post("/api/v1/cards", (req, res) => {
//   (authenticate, getCurrentUser, createCard)
// });
//
// var createCard = function (req, res) {
//   let user = req.user;
//   let newCard = new Card({
//     number: req.number,
//   	retailer: req.retailer,
//     expiration: req.expiration,
//     balance: req.balance
//   })
//   user.cards.push(newCard)
//   user.save((err, user) => {
//     if(err){
//       console.error(err)
//     } else {
//       console.log(user)
//       res.send(newCard)
//       process.exit()
//     }
//   })
// };

app.listen(1337);
module.exports = app;

console.log('Server running at http://127.0.0.1/1337');
