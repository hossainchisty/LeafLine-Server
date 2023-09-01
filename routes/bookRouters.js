const express = require('express');
const multer = require('multer');
const router = express.Router();

const {
  getBooks,
  getBookByID,
  getBooksList,
  addBook,
  updateBook,
  deleteBook,
  searchBook,
} = require('../controllers/bookController');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

const uploadMiddleware = multer({ storage }).single('image');

// API Endpoints for Managing Books
router.get('/list', getBooksList);

// Search for books by title
router.get('/search', searchBook);

router
  .route('/')
  .get(getBooks)
  .post(uploadMiddleware, addBook)
  .put(uploadMiddleware, updateBook);

router.route('/:id').delete(deleteBook).get(getBookByID);

module.exports = router;
