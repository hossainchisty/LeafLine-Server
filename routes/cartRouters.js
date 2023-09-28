// Basic Lib Imports
const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  removeItemFromCart,
  removeAllItemsFromCart,
  updateCartItemQuantity,
} = require("../controllers/cartController");

const { authMiddleware } = require("../middleware/authMiddleware");

// Routing Implement
router.get("/", authMiddleware, getCart);
router.post("/add", authMiddleware, addToCart);
router.put("/updatequantity", authMiddleware, updateCartItemQuantity);
router.delete("/remove/:productId", authMiddleware, removeItemFromCart);
router.delete("/remove-all", authMiddleware, removeAllItemsFromCart);

module.exports = router;
