const asyncHandler = require('express-async-handler');
const Book = require('../book/book.model');
const { sendResponse } = require('../../../services/responseService');

// Get books for a given user request
const getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({ user: req.user.id }).sort({ createdAt: -1 });
  return sendResponse(
    res,
    200,
    false,
    'Books data fetched successfully!',
    books
  );
});

// Get list of books
const getBooksList = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = 12;
  const skip = (page - 1) * itemsPerPage;

  const [books, totalBooks] = await Promise.all([
    Book.find().sort({ createdAt: -1 }).skip(skip).limit(itemsPerPage),
    Book.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalBooks / itemsPerPage);
  const nextPage = page < totalPages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  return sendResponse(res, 200, true, 'Books data fetched successfully!', {
    books,
    currentPage: page,
    totalPages,
    nextPage,
    prevPage,
  });
});

// Get a book by ID
const getBookByID = asyncHandler(async (req, res, next) => {
  const bookId = req.params.id;

  try {
    const book = await Book.findByIdAndUpdate(
      bookId,
      { $inc: { read: 1 } },
      { new: true }
    ).lean();

    if (!book) {
      return sendResponse(res, 404, false, 'No books found');
    }

    return sendResponse(res, 200, true, 'Books retrieved successfully', book);
  } catch (error) {
    next(error);
  }
});

// Get a book by title
const getBookByTitle = asyncHandler(async (req, res, next) => {
  const title = req.params.title;

  try {
    const books = await Book.find({
      title: { $regex: new RegExp(title, 'i') },
    });

    if (books.length === 0) {
      return sendResponse(res, 404, false, 'No books found');
    }

    return sendResponse(res, 200, true, 'Books retrieved successfully', books);
  } catch (error) {
    next(error);
  }
});

// Create a new book for the authenticated user
const addBook = asyncHandler(async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      rating,
      featured,
      author,
      thumbnail,
      publishYear,
      publishDate,
      ISBN,
      language,
      publisher,
      pages,
    } = req.body;

    const bookData = {
      // user: req.user.id,
      title,
      description,
      price,
      rating,
      featured,
      author,
      thumbnail,
      publishYear,
      publishDate,
      ISBN,
      pages,
      language,
      publisher,
    };

    const book = await Book.create(bookData);
    return sendResponse(res, 201, true, 'Book created successfully', book);
  } catch (error) {
    next(error)
  }
});

// Update book
const updateBook = asyncHandler(async (req, res, next) => {
  try {
    const {
      id,
      title,
      price,
      rating,
      featured,
      author,
      thumbnail,
      publishYear,
    } = req.body;

    const book = await Book.findById(id).lean();
    if (!book) {
      return sendResponse(res, 404, false, 'Book not found');
    }

    if (book.user.toString() !== req.user.id) {
      return sendResponse(
        res,
        403,
        false,
        'Unauthorized - User does not have permission to update this book'
      );
    }

    await Book.updateOne(
      { _id: id },
      { title, price, rating, featured, author, thumbnail, publishYear }
    );

    return sendResponse(res, 200, true, 'Book updated successfully');
  } catch (error) {
    next(error);
  }
});

// Delete book
const deleteBook = asyncHandler(async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return sendResponse(res, 404, true, 'Book not found');
    }

    if (book.user.toString() !== req.user.id) {
      return sendResponse(
        res,
        403,
        false,
        'Unauthorized - User does not have permission to delete this book'
      );
    }

    const deletedBook = await Book.findByIdAndRemove(req.params.id, req.body, {
      new: true,
    });
    return sendResponse(res, 200, false, 'Book was deleted', deletedBook);
  } catch (error) {
    next(error);
  }
});

// Search books by title
const searchBook = asyncHandler(async (req, res, next) => {
  const { title, author } = req.query;

  try {
    const books = await Book.find({
      title: { $regex: new RegExp(title, 'i') },
      author: { $regex: new RegExp(author, 'i') },
    });

    if (books.length === 0) {
      return sendResponse(res, 404, false, 'Book not found');
    }
    return sendResponse(res, 200, true, 'Books retrieved successfully', books);
  } catch (error) {
    next(error);
  }
});

module.exports = {
  getBooks,
  getBookByID,
  getBookByTitle,
  getBooksList,
  addBook,
  updateBook,
  deleteBook,
  searchBook,
};
