const Cart = require("../models/cartModel");
const asyncHandler = require("express-async-handler");

/**
 * @desc    Get user's cart
 * @route   /api/v1/cart/
 * @method  POST
 * @access  Private
 */

exports.getUserCart = async (req, res) => {
  const userId = req.user.id;

  try {
    // Find all cart items for the user
    const cartItems = await Cart.find({ userId }).populate("productId");

    res.status(200).json({ cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

/**
 * @desc    Add item to the cart
 * @route   /api/v1/cart/add
 * @method  POST
 * @access  Private
 */

exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    // Check if the item is already in the user's cart
    let cartItem = await Cart.findOne({ userId, productId });

    if (!cartItem) {
      // If not, create a new cart item
      cartItem = new Cart({ userId, productId, quantity });
    } else {
      // If it exists, update the quantity
      cartItem.quantity += quantity;
    }

    // Save the cart item
    await cartItem.save();

    res.status(201).json({
      status: 201,
      success: true,
      message: "Item added to the cart.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

/**
 * @desc    Remove item from the cart
 * @route   /api/v1/cart/remove/:productId
 * @method  DELETE
 * @access  Private
 */

exports.removeItemFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    // Find and remove the cart item
    await Cart.findOneAndRemove({ userId, productId });

    res.status(200).json({
      status: 200,
      success: true,
      message: "Item removed from cart successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};
