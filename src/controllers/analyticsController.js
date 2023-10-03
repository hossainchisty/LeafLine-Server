const asyncHandler = require("express-async-handler");
const Book = require("../models/bookModel");
const User = require("../models/userModel");

// Get analytics for admin panel
const dashboard = asyncHandler(async (req, res) => {
  const total_books = await Book.countDocuments();
  const featured_books = await Book.countDocuments({ featured: true });
  const total_users = await User.countDocuments();

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Analytics fetched successfully",
    data: {
      total_books,
      featured_books,
      total_users,
    },
  });
});

module.exports = dashboard;
