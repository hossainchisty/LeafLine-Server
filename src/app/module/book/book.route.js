const express = require('express');
const router = express.Router();

const {
  getBooks,
  getBookByID,
  getBooksList,
  getBookByTitle,
  addBook,
  updateBook,
  deleteBook,
  searchBook,
} = require('./book.controller');

// API Endpoints for Managing Books
router.get('/list', getBooksList);
router.get('/find/:title', getBookByTitle);
router.get('/book/search', searchBook);
router.get('/:id', getBookByID);
router.delete('/:id', deleteBook);
router.route('/').get(getBooks).post(addBook).put(updateBook);

module.exports = router;
