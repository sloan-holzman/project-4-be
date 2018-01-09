const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/project-4-db")

if (process.env.NODE_ENV == "production") {
  mongoose.connect(process.env.MLAB_URL, { userMongoClient: true })
} else {
  mongoose.connect("mongodb://localhost:27017/project-4-db");
}


module.exports = mongoose
