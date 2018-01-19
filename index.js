require('newrelic');
const mongoose = require("./db/schema.js")
const User = require("./db/schema").User;
const Card = require("./db/schema").Card;
const Retailer = require("./db/schema").Retailer;
const passport = require('passport')
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const bodyParser = require('body-parser')
const request = require('request')
const twitterConfig = require('./twitter.config.js')
const passportConfig = require('./passport');
require('./routes/loginroutes')(app);
require('./routes/cardroutes')(app);

passportConfig();

app.listen(process.env.PORT || 1337, () => {
  console.log("Server running at http://127.0.0.1/1337");
});

module.exports = app;
