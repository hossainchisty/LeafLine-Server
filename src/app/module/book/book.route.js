const express = require('express');
const router = express.Router();

const bookController = require('./book.controller');

// API Endpoints for Managing Books
router.get('/list', bookController.getBooksList);
router.get('/find/:title', bookController.getBookByTitle);
router.get('/book/search', bookController.searchBook);
router.get('/:id', bookController.getBookByID);
router.delete('/:id', bookController.deleteBook);
router.route('/').get(bookController.getBooks).post(bookController.addBook).put(bookController.updateBook);

module.exports = router;
