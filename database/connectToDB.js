const mongoose = require("mongoose")

mongoose.set("bufferCommands", false);

const connectToDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("connected to DB"))
    .catch(error => console.error('error while connecting to DB', error))
}

module.exports = connectToDB;