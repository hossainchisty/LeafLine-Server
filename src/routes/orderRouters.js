// Basic Lib Imports
const express = require("express");
const router = express.Router();

const { createOrder } = require("../controllers/paymentController");
const {
  orderLists,
  updateOrderStatus,
} = require("../controllers/orderController");

const { authMiddleware } = require("../middleware/authMiddleware");

// Routing Implement
router.get("/", authMiddleware, orderLists);
router.patch("/:orderId/update-status", authMiddleware, updateOrderStatus);
router.post("/charge/create-order", authMiddleware, createOrder);

module.exports = router;
