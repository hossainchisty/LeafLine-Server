const asyncHandler = require("express-async-handler");
const Book = require("../models/bookModel");

// Get books for a given user request
const getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({ user: req.user.id }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 200,
    data: {
      books,
    },
  });
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

// Get a book by ID
const getBookByID = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findByIdAndUpdate(
      id,
      { $inc: { read: 1 } },
      { new: true }
    ).lean();

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

// Get a book by title
const getBookByTitle = asyncHandler(async (req, res) => {
  const title = req.params.title;

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

    return res.status(200).json({
      status: 200,
      data: books,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: "Internal Server Error",
      message: "An error occurred while fetching the book.",
    });
  }
});

// Create a new book for the authenticated user
const addBook = asyncHandler(async (req, res) => {
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

// Update book
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

    const book = await Book.findById(id).lean();
    if (!book) {
      return res.status(404).json({
        status: 404,
        message: "Book not found",
      });
    }

    if (book.user.toString() !== req.user.id) {
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

// Delete book
const deleteBook = asyncHandler(async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        status: 404,
        message: "Book not found",
      });
    }

    if (book.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 403,
        message:
          "Unauthorized - User does not have permission to delete this book",
      });
    }

    const deletedBook = await Book.findByIdAndRemove(req.params.id, req.body, {
      new: true,
    });

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

// Search books by title
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
