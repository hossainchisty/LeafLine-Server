const mongoose = require('mongoose');
const Order = require('../order/order.model');
const Book = require('../book/book.model');
const stripe = require('stripe')(`${process.env.STRIPE_API_KEY}`);

/**
 * @desc    Payment with srtipe
 * @route   /api/v1/payment/charge/create-order
 * @method  POST
 * @access  Private
 */

exports.createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { books, shippingAddress, shippingPrice } = req.body;

    // Basic Validation
    if (!books || !Array.isArray(books) || books.length === 0) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Validation error',
        errors: [
          {
            field: 'books',
            message: 'Books array is required and must not be empty',
          },
        ],
      });
    }

    // Validate each book item
    for (const bookItem of books) {
      if (!bookItem.bookId || !bookItem.quantity || bookItem.quantity <= 0) {
        return res.status(400).json({
          statusCode: 400,
          message: 'Validation error',
          errors: [
            {
              field: 'books',
              message: 'Invalid book item',
            },
          ],
        });
      }
    }

    if (typeof shippingPrice !== 'number' || shippingPrice < 0) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Validation error',
        errors: [
          {
            field: 'shippingPrice',
            message: 'Shipping price must be a non-negative number',
          },
        ],
      });
    }

    // Validate each book item and calculate subTotal
    let totalPrice = 0;
    for (const bookItem of books) {
      const book = await Book.findById(bookItem.bookId);
      if (!book || !book.price || isNaN(book.price)) {
        console.error(
          `Book with ID ${bookItem.bookId} not found or price is invalid`
        );
        return res.status(400).json({
          statusCode: 400,
          message: 'Book not found or price is invalid',
        });
      }
      if (isNaN(bookItem.quantity) || bookItem.quantity <= 0) {
        console.error(`Invalid quantity for book ${bookItem.bookId}`);
        return res.status(400).json({
          statusCode: 400,
          message: 'Invalid quantity for one or more books',
        });
      }
      const subTotal = Number(book.price * bookItem.quantity); // Calculate subTotal for each book
      if (isNaN(subTotal)) {
        console.error(
          `Subtotal calculation for book ${bookItem.bookId} resulted in NaN`
        );
        return res.status(400).json({
          statusCode: 400,
          message: 'Subtotal calculation error for one or more books',
        });
      }
      bookItem.subTotal = subTotal;
      totalPrice += subTotal; // Add subTotal to totalPrice
    }

    // Add shipping cost
    totalPrice += shippingPrice;

    // Calculate subtotal of all books
    let totalSubTotal = 0;
    books.forEach(bookItem => {
      totalSubTotal += bookItem.subTotal;
    });

    // We need to pass an array for session
    const dataInsert = [
      {
        user: req.user.id,
        books: books.map(bookItem => ({
          bookId: bookItem.bookId,
          quantity: bookItem.quantity,
          subTotal: bookItem.subTotal,
        })),
        subTotal: totalSubTotal,
        totalPrice,
        shippingAddress,
        shippingPrice,
      },
    ];

    // Create the order
    const newOrder = await Order.create(dataInsert, { session });

    // Stripe Payment Intent
    const totalAmountInCents = Math.round(totalPrice * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmountInCents,
      currency: 'usd',
      metadata: {
        company: 'LeafLine',
        order_id: newOrder._id,
      },
    });

    // // Update the isPaid field on newOrder
    // newOrder.isPaid = true;
    // newOrder.paidAt = Date.now();

    // // Save the changes
    // await newOrder.save();

    await session.commitTransaction();

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
