const express = require("express")
const router = express.Router();
const { registerUser, loginUser, deleteUser, verifyUser } = require("../controllers/auth.controller")
const { validateInput, validateResult, authenticateToken } = require("../middlewares/auth.middleware")
const { body } = require("express-validator");

// register a new account
router.post('/register', [body('username').trim().isLength({ min: 5 }).withMessage("username must contain atleast 5 characters"), ...validateInput], validateResult, registerUser);

// login in account
router.post('/login', validateInput, validateResult, loginUser)

router.post('/verify', authenticateToken, verifyUser);

// delete account
router.delete('/delete', authenticateToken, deleteUser);

module.exports = router;
