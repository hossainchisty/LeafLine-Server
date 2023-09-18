// Basic Lib Imports
const express = require("express");
const router = express.Router();

const {
  addToWishlist,
  removeFromWishlist,
  getWishlistBooks,
} = require("../controllers/wishlistController");

const { authMiddleware } = require("../middleware/authMiddleware");

// Routing Implement
router.get("/", authMiddleware, getWishlistBooks);
router.post("/add", authMiddleware, addToWishlist);
router.delete("/remove", authMiddleware, removeFromWishlist);

module.exports = router;
