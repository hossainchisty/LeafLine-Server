// Basic Lib Imports
const express = require("express");
const router = express.Router();

const {
  addToCart,
  getUserCart,
  removeItemFromCart,
} = require("../controllers/cartController");

const { authMiddleware } = require("../middleware/authMiddleware");

// Routing Implement
router.get("/", authMiddleware, getUserCart);
router.post("/add", authMiddleware, addToCart);
router.delete("/remove/:productId", authMiddleware, removeItemFromCart);

module.exports = router;
