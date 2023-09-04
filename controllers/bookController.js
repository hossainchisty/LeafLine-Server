const asyncHandler = require("express-async-handler");
const Book = require("../models/bookModel");
const verifyAuthorization = require("../utility/verifyAuthorization");

/**
 * @desc  Get books for a given user request
 * @route   /api/v1/books/list
 * @method  GET
 * @access  Private
 */

const getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({ user: req.user.id }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 200,
    data: {
      books,
    },
  });
});

/**
 * @desc  Get list of books
 * @route   /api/v1/books/lists
 * @method  GET
 * @access  Public
 */

const getBooksList = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the requested page number = require() query string
  const itemsPerPage = 12; // Number of items to show per page

  const totalBooks = await Book.countDocuments(); // Total number of books

  const books = await Book.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * itemsPerPage) // Calculate the number of books to skip
    .limit(itemsPerPage); // Limit the number of books to retrieve

  const totalPages = Math.ceil(totalBooks / itemsPerPage);

  const nextPage = page < totalPages ? page + 1 : null; // Calculate the next page number
  const prevPage = page > 1 ? page - 1 : null; // Calculate the previous page number

  res.status(200).json({
    status: 200,
    data: {
      books,
      currentPage: page,
      totalPages,
      nextPage,
      prevPage,
    },
  });
});

/**
 * @desc    Get a book
 * @route   /api/v1/books/:bookID
 * @method  GET
 * @access  Private
 * @return Book based on the given id
 */

const getBookByID = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findByIdAndUpdate(
      id,
      { $inc: { read: 1 } }, // Increment read by 1
      { new: true } // Return the updated document
    )
      .populate("author", ["full_name"])
      .lean();

    if (!book) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: "Book not found.",
      });
    }

    return res.status(200).json({
      status: 200,
      data: book,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: "Internal Server Error",
      message: "An error occurred while fetching the book.",
    });
  }
});

/**
 * @desc    Get a book
 * @route   /api/v1/books/:bookTitle
 * @method  GET
 * @access  Private
 * @return Book based on the given title
 */

const getBookByTitle = asyncHandler(async (req, res) => {
  const title = req.params.title;

  try {
    const book = await Book.find({
      title: { $regex: new RegExp(title, "i") },
    });

    if (book.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No books found",
      });
    }

    return res.status(200).json({
      status: 200,
      data: book,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: "Internal Server Error",
      message: "An error occurred while fetching the book.",
    });
  }
});


/**
 * @desc    Create a new book for the authenticated user
 * @route   /api/v1/books
 * @method  POST
 * @access  Private
 * @returns {object} Newly added book in json format
 */

const addBook = asyncHandler(async (req, res) => {
  try {
    const { title, price, rating, featured, author, thumbnail, publishYear } =
      req.body;

    // const { token } = req.cookies;
    // const userData = verifyAuthorization(token);

    const bookData = {
      // user: userData.id,
      title,
      price,
      rating,
      featured,
      author,
      thumbnail,
      publishYear,
    };

    const book = await Book.create(bookData);
    res.status(201).json({
      status: 201,
      data: book,
      message: "Book created successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
});

/**
 * @desc    Update book
 * @route   /api/v1/books/
 * @method  PUT
 * @access  Private
 */
const updateBook = asyncHandler(async (req, res) => {
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
    const { token } = req.cookies;
    const info = verifyAuthorization(token);

    const book = await Book.findById(id).lean();
    if (!book) {
      return res.status(404).json({
        status: 404,
        message: "Book not found",
      });
    }

    const isAuthor = JSON.stringify(book.user) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(403).json({
        status: 403,
        message:
          "Unauthorized - User does not have permission to update this book",
      });
    }

    await Book.updateOne(
      { _id: id },
      { title, price, rating, featured, author, thumbnail, publishYear }
    );

    res.status(200).json({
      status: 200,
      message: "Book updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "An error occurred while updating the book",
    });
  }
});

/**
 * @desc    Delete book
 * @route   /api/v1/books/:id
 * @method  DELETE
 * @access  Private
 */
const deleteBook = asyncHandler(async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!req.user) {
      res.status(401).json({
        status: 401,
        message: "User not authenticated",
        suggestion: "Please provide valid authentication information.",
      });
    }

    if (book.user.toString() !== req.user.id) {
      res.status(401).json({
        status: 401,
        error: "Unauthorized",
        message: "User is authenticated but not authorized",
        suggestion: "Please provide valid authentication information.",
      });
    }

    const deletedBook = await Book.findByIdAndRemove(req.params.id, req.body, {
      new: true,
    });

    if (!deletedBook) {
      res.status(404).json({
        status: 404,
        message: "Book not found",
      });
    }

    res.status(200).json({
      data: deletedBook,
      id: req.params.id,
      message: "Book was deleted.",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
});

/**
 * @desc    Search books by title
 * @route   /api/v1/books/search
 * @method  GET
 * @access  Public
 */

const searchBook = asyncHandler(async (req, res) => {
  const { title } = req.query;

  try {
    const books = await Book.find({
      title: { $regex: new RegExp(title, "i") },
    });

    if (books.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No books found",
      });
    }

    res.status(200).json({
      status: 200,
      data: {
        books,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      error: "Internal Server Error",
      message: "An error occurred while searching for books.",
    });
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
