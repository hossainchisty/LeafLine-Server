const shortid = require("shortid");
const mongoose = require("mongoose");

// Order Schema Definition

const orderItemSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    items: [orderItemSchema],
    totalPrice: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered"],
      default: "Pending",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String,
      default: "Card",
    },
    trackingNumber: {
      type: String,
      unique: true,
      default: () => shortid.generate(),
      indexed: true,
    },
    transactionId: {
      type: String,
      unique: true,
      default: () => shortid.generate(),
      indexed: true,
    },
    delivereAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true, versionKey: false }
);

// Middleware to generate custom transactionId
orderSchema.pre("save", function (next) {
  if (!this.transactionId) {
    this.transactionId = shortid.generate();
  }
  next();
});

// Middleware to generate custom trackingNumber
orderSchema.pre("save", function (next) {
  if (!this.trackingNumber) {
    this.trackingNumber = `LLTN-${shortid.generate()}`;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
