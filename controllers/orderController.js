const Order = require("../models/orderModel");

/**
 * @desc    Get order lists of customers
 * @route   /api/v1/order/
 * @method  GET
 * @access  Private
 */

const orderLists = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = 12;
  const skip = (page - 1) * itemsPerPage;

  const [orders, totalOrders] = await Promise.all([
    Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(itemsPerPage)
      .populate("user"),
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
};

/**
 * @desc    Update the status of an order
 * @route   /api/v1/orders/:orderId/update-status
 * @method  PATCH
 * @access  Private
 */

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { newStatus } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update the status field
    order.status = newStatus;

    // Save the updated order to the database
    await order.save();

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Order status updated successfully",
      updatedOrder: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  orderLists,
  updateOrderStatus,
};
