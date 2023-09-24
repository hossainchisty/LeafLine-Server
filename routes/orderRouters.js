// Basic Lib Imports
const express = require("express");
const router = express.Router();

const {
    createOrder,
    orderLists
} = require('../controllers/paymentController');

const { authMiddleware } = require("../middleware/authMiddleware");

// Routing Implement
router.get("/", authMiddleware, orderLists);
router.post("/charge/create-order", authMiddleware, createOrder);

module.exports = router;