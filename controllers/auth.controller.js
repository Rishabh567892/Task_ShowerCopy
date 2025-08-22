const User = require("../models/user.model")
const Task = require("../models/task.model")
const Token = require("../models/token.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // verifies is the email already in-use.
  const existingUser = await User.findOne({ email: email });
  if (existingUser) return res.status(409).json({
    status: false,
    message: "username or email already exists"
  })

  let hashedPassword, user;

  try {

    const salt = await bcrypt.genSalt(8)
    // password to be saved in data-base
    hashedPassword = await bcrypt.hash(password, salt);

  } catch (error) {
    // if error occurs while creating a hash password
    return res.status(500).json({
      status: false,
      error: error.message,
      message: "password cannot be secured",
    })
  }

  try {

    // tries to create a new user in data-base
    user = await User.create({
      username: username,
      email: email,
      password: hashedPassword
    })

  } catch (error) {
    // error if user cannot be created in data-base
    return res.status(401).json({
      status: false,
      error: error.message,
      message: "you cannot be registered"
    })
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  )

  await Token.create({token: token})

  // message for user being successfully created
  res.status(201).json({
    status: true,
    message: 'you are registered as a new user',
    token
  })

}

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {

    // check if email exists
    let existingUser = await User.findOne({ email: email });

    // if there isn't any user with such email
    if (!existingUser) return res.status(401).json({
      status: false,
      message: "Invalid password or email"
    })

    // compares the password given by user and the password stored in data-base
    let isMatch = await bcrypt.compare(password, existingUser.password)

    // if both passwords aren't the same
    if (!isMatch) return res.status(401).json({
      status: false,
      message: "Invalid password or email"
    })

    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    )

    // if email and password are correct
    res.status(200).json({
      status: true,
      message: "you logged in successfully",
      token
    })

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message
    })
  }
}

const deleteUser = async (req, res) => {
  const { password } = req.body;

  try {
    // check whether the user exists
    const existingUser = await User.findOne({ email: req.user.email });
    if (!existingUser) return res.status(404).json({
      status: false,
      message: "Invalid credentials"
    })

    // compares passwords from user and data-base
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) return res.status(401).json({
      status: false,
      message: "Invalid password"
    })

    await existingUser.deleteOne(); // delete the existingUser

    await Task.findOneAndDelete({user: existingUser._id}) // find is there a document based on this user in Task model

    return res.status(200).json({
      status: true,
      message: "Account deleted Successfully"
    })

  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
      message: "Internal server error"
    })
  }
}

module.exports = { registerUser, loginUser, deleteUser };