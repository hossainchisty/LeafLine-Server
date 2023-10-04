const express = require('express');
const router = express.Router();

const bookController = require('./book.controller');

// API Endpoints for Managing Books
router.route('/').post(bookController.addBook).put(bookController.updateBook);
router.get('/list', bookController.getBooksList);
router.get('/book/search', bookController.searchBook);
router.get('/:id', bookController.getBookByID);
router.delete('/:id', bookController.deleteBook);

module.exports = router;
