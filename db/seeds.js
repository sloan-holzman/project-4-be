const User = require("./schema").User;
const Card = require("./schema").Card;

// User.remove({})
//   .then(() => {
//     console.log("Users removed successfully!");
//     process.exit()
//   })

let newCard = new Card({
  number: "123455669",
  retailer: "Target",
  expiration: Date.now,
  balance: 10.50
})

console.log(newCard)

User.findOne({email: 'sloan.holzman@gmail.com'})
.then((sloan) => {
  sloan.cards.push(newCard)
  sloan.save((err, user) => {
    if(err){
      console.error(err)
    } else {
      process.exit()
    }
  })
})
