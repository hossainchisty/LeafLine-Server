// Import the necessary models and dependencies
const asyncHandler = require("express-async-handler");
const Book = require("../models/bookModel");

/**
 * @desc     Create a new review
 * @route    /api/v1/reviews/:bookId
 * @method   POST
 * @access   Private
 * @param    {string} bookId - The ID of the product being reviewed
 * @requires  {number} rating - The rating given to the product (between 1 and 5)
 * @requires  {string} comment - The comment or review text
 * @returns  {Object} The newly created review
 * @requires User Account
 */

const createReview = asyncHandler(async (req, res, next) => {
  const { bookId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  try {
    const product = await Book.findOne({ _id: bookId }).lean();

    if (!product) {
      return res.status(404).json({
        statusCode: 404,
        message: "Product not found.",
      });
    }

    // const existingReview = product.reviews.find(
    //   (review) => review.user && review.user.toString() === userId
    // );

    // if (existingReview) {
    //   return res.status(409).json({
    //     statusCode: 409,
    //     success: false,
    //     message: "You have already reviewed this product.",
    //   });
    // }

    const updatedProduct = await Book.findByIdAndUpdate(
      bookId,
      {
        $addToSet: {
          reviews: {
            user: userId,
            rating,
            comment,
          },
        },
      },
      { new: true },
    );

    const totalReviews = updatedProduct.reviews.length;
    const sumRatings = updatedProduct.reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );

    // Calculate the new average rating for the product
    const averageRating = sumRatings / totalReviews;
    updatedProduct.averageRating = averageRating;

    await updatedProduct.save();

    res.status(201).json({
      statusCode: 201,
      success: true,
      message: "Review submitted successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  createReview,
};
