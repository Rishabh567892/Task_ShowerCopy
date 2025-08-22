const { body, validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")
const Task = require("../models/task.model")
const User = require("../models/user.model")

const validateInput = [
  body('email').trim().isEmail().withMessage("this field must be an email").isLength({ min: 10 }).withMessage("email must contain atleast 10 characters"),
  body('password').trim().isLength({ min: 8 }).withMessage("password must contain atleast 8 characters")
]

const validateResult = (req, res, next) => {
  const error = validationResult(req);

  if (error.isEmpty()) return next();

  return res.status(422).json({
    status: false,
    message: "wrong user input",
    error: error.array()
  })
}

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // console.log(token)

  if (!token) return res.status(401).json({
    status: false,
    message: "user is not logged in",
    header: authHeader
  })

  try {

    let decode = jwt.verify(token, process.env.JWT_SECRET)

    const existingUser = await User.findOne({email: decode.email});

    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "user is unauthorized"
      })
    }
    
    req.user = decode;
    next()

  } catch (error) {
    return res.status(403).json({
      status: false,
      message: "Invalid token"
    })
  }
}

const verfiyTask = async (req, res, next) => {
  const user = req.user;
  // console.log(user._id || user.id)
  
  try {
    let task = await Task.findOne({ user: user._id || user.id });

    if (!task) {
      // no task with user so creating a new document in task model
      task = await Task.create({
        user: user._id || user.id,
        tasks: []
      })
    }

    req.task = task;
    
    next();

  } catch(error){
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    })
  }
}

module.exports = { validateInput, validateResult, authenticateToken, verfiyTask }