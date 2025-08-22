const mongoose = require("mongoose")

module.exports = mongoose.model('Token', new mongoose.Schema({
  token: String
}))