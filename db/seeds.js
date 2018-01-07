const User = require("./schema").User;

User.remove({})
  .then(() => {
    console.log("Users removed successfully!");
  })
