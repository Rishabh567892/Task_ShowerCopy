const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  tasks: [String],
  numberOfTasks: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('Task', taskSchema)