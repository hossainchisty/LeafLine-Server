const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(`${process.env.STRIPE_API_KEY}`);

/**
 * @desc    Get order lists of customers
 * @route   /api/v1/order/
 * @method  GET
 * @access  Private
 */
const orderLists = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = 12;
  const skip = (page - 1) * itemsPerPage;

  const [orders, totalOrders] = await Promise.all([
    Order.find().sort({ createdAt: -1 }).skip(skip).limit(itemsPerPage),
    Order.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalOrders / itemsPerPage);
  const nextPage = page < totalPages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Order retrieved successfully", 
    data: {
      orders,
      currentPage: page,
      totalPages,
      nextPage,
      prevPage,
    },
  });
});

/**
 * @desc    Payment with srtipe
 * @route   /api/v1/order/charge/create-order
 * @method  POST
 * @access  Private
 */

const createOrder = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { address, city, postalCode, items, totalAmount } = req.body;

    const newOrder = await Order.create(
      {
        customerId: req.user.id,
        items: items,
        totalPrice: totalAmount,
        address: address,
        city: city,
        postalCode: postalCode,
        isPaid: false, // Set isPaid to false initially
      },
      { session }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: newOrder.totalPrice * 100,
      currency: "usd",
      metadata: {
        order_id: newOrder._id.toString(),
      },
    });

    // Assuming the payment is successful (you should verify this in your Stripe webhook or callback)
    // Update the order's isPaid field to true
    newOrder.isPaid = true;
    await newOrder.save();

    await session.commitTransaction();
    session.endSession();

    res.json({
      clientSecret: paymentIntent.client_secret,
      orderId: newOrder._id,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error creating order:", error);
    res.status(500).json({
      statusCode: 500,
      success: true,
      message: "Error creating order",
    });
  }
});



module.exports = {
  orderLists,
  createOrder,
};
