const mongoose = require("mongoose")

// mongoose.connect("mongodb://localhost:27017/project-4-db")

//connects to local or production database, depending on environment
if (process.env.NODE_ENV == "production") {
  mongoose.connect(process.env.MLAB_URL)
} else {
  mongoose.connect("mongodb://localhost:27017/project-4-db");
}


module.exports = mongoose
