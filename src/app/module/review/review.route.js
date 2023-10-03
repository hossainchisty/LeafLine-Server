// Basic Lib Imports
const express = require('express');
const router = express.Router();

const { createReview } = require('./review.controller');

const { authMiddleware } = require('../../middleware/authMiddleware');

// Routing Implement
router.post('/:bookId', authMiddleware, createReview);

module.exports = router;
