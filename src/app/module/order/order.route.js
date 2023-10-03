// Basic Lib Imports
const express = require('express');
const router = express.Router();

const { orderLists, updateOrderStatus } = require('./order.controller');

const { authMiddleware } = require('../../middleware/authMiddleware');

// Routing Implement
router.get('/', authMiddleware, orderLists);
router.patch('/:orderId/update-status', authMiddleware, updateOrderStatus);

module.exports = router;
