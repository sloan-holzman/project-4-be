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

  let cors_list

  if (process.env.NODE_ENV === "production") {
    cors_list = {
      origin: "http://virtual-wallet.surge.sh",
      default: "http://virtual-wallet.surge.sh"
    };
  } else {
    cors_list = {
      origin: "http://127.0.0.1:3000",
      default: "http://127.0.0.1:3000"
    };
  }

  var corsOption = {
    origin: cors_list,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
  };
  app.use(cors(corsOption));

  // app.options('*', cors())




  // app.use(cors(cors_list));



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
    }, twitterSecret,
    {
      expiresIn: 60 * 120
    });
  };

  var generateToken = function (req, res, next) {
    req.token = createToken(req.auth);
    return next();
  };

  // var sendToken = function (req, res) {
  //   res.setHeader('x-auth-token', req.token);
  //   return res.status(200).send(JSON.stringify(req.user));
  // };

  var sendToken = function (req, res) {
    res.setHeader('x-auth-token', req.token);
    // let jsonUser = JSON.stringify(req.user)
    Retailer.find({}, function(err, foundRetailers) {
      if (err) {
        res.send(500, 'err')
      } else {
        res.status(200).json({user: req.user, retailers: foundRetailers})
      }
    })
  }

  app.post("/api/v1/auth/twitter/reverse", function(req, res) {
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

        var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        res.send(JSON.parse(jsonStr));
      });
    });

    app.post("/api/v1/auth/twitter", function(req, res, next) {
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
    secret: twitterSecret,
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

}
