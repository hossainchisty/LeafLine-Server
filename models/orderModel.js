const mongoose = require("mongoose");

// Order Schema Definition

const orderSchema = mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      index: { unique: true },
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      indexed: true,
      index: { unique: true },
    },
    items: [
      {
        itemName: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, versionKey: false },
);

// Middleware to generate orderId and transactionId
orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    this.orderId = new mongoose.Types.ObjectId();
  }
  if (!this.transactionId) {
    this.transactionId = new mongoose.Types.ObjectId();
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
