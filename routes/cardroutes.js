const expressJwt = require('express-jwt')
const mongoose = require("../db/schema.js")
const User = mongoose.User;
const Card = mongoose.Card;
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

module.exports = function(app){

  app.get('/api/v1/cards',
    expressJwt({secret: 'my-secret'}),
    function(req, res) {
      User.findById(req.user.id, function(err, user) {
        if (err) {
          res.send(401, 'User Not Authenticated');
        } else {
          res.json(user)
        }
          })
      }
  );


  app.post('/api/v1/cards',
    expressJwt({secret: 'my-secret'}),
    function(req, res) {
      User.findById(req.user.id, function(err, user) {
        if (err) {
          res.send(401, 'User Not Authenticated');
        } else {
          let newCard = new Card(req.body)
          user.cards.push(newCard)
          user.save((err, user) => {
            if(err){
              res.send(500, 'Failed to create card')
            } else {
              res.json(user.cards)
            }
          })
        }
      });
    }
  )

  app.put('/api/v1/cards/:id',
    expressJwt({secret: 'my-secret'}),
    function(req, res) {
      User.findById(req.user.id, function(err, user) {
        var card = user.cards.find((card) => card._id == req.params.id);
        // card.set(req.body)
        // card.set({ $currentDate: { updated: true })
        card.set(
          {
            $currentDate: {
              updated: true,
            },
              number: req.body.number,
              retailer: req.body.retailer,
              expiration: req.body.expiration,
              balance: req.body.balance,
              pin: req.body.pin
          }
        )
        user.save()
        .then(function(user) {
          res.send(user.cards);
        })
        .catch(function(err) {
          res.status(500).send(err);
        })
      })
    }
  )


  app.delete('/api/v1/cards',
    expressJwt({secret: 'my-secret'}),
    function(req, res) {
      User.findById(req.user.id, function(err, user) {
        if (err) {
          res.send(401, 'User Not Authenticated');
        } else {
          user.cards.pull(req.body.card_id)
          user.save((err, user) => {
            if(err){
              res.send(500, 'Failed to delete card')
            } else {
              res.json(user.cards)
            }
          })
        }
      });
    }
  )
}
