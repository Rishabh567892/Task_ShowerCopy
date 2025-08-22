const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: [5, 'User name must be atleat 5 characters long'],
    required: [true, 'User name must be provided'],
    trim: true
  },
  email: {
    type: String,
    minlength: [10, 'Email must contain atleast 10 letters'],
    required: [true, 'Email must be provided.'],
    // match: ['/\S+@\S+\.\S/', 'Please enter a valid email'],
    trim: true,
    unique: [true, 'Choose another account']
  },
  password: {
    type: String,
    minlength: [8, 'Password must contain atleat 8 characters'],
    required: [true, 'Password must be provided'],
    trim: true
  }
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema);