// Basic Lib Imports
const express = require("express");
const router = express.Router();

const {
  createAccountLimiter,
  forgetPasswordLimiter,
  verifyLimiter,
} = require("../services/rateLimitService");

const ExpressBrute = require("express-brute");

var store = new ExpressBrute.MemoryStore();
// stores state locally, don't use this in production
var bruteforce = new ExpressBrute(store);

const {
  registerUser,
  loginUser,
  logoutUser,
  forgetPassword,
  resetPassword,
  emailVerify,
} = require("../controllers/authController");

const {
  getMe,
  userList,
  findUserById,
} = require("../controllers/userController");

const { authMiddleware } = require("../middleware/authMiddleware");

// Routing Implement
router.get("/", userList);
router.get("/user/:id", findUserById);
router.post("/register", createAccountLimiter, registerUser);
router.post("/verify", verifyLimiter, emailVerify);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getMe);
router.post("/reset-password", resetPassword);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgetPasswordLimiter, forgetPassword);

module.exports = router;
