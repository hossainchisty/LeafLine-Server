const express = require('express');
const router = express.Router();

const bookController = require('./book.controller');
const { authMiddleware } = require('../../middleware/authMiddleware');

// API Endpoints for Managing Books
router.route('/').post(bookController.addBook, authMiddleware).put(bookController.updateBook);
router.get('/list', bookController.getBooksList);
router.get('/search', bookController.searchBook);
router.get('/:id', bookController.getBookByID);
router.delete('/:id', bookController.deleteBook);

module.exports = router;
