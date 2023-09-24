const shortid = require("shortid");
const mongoose = require("mongoose");

// Order Schema Definition

const orderSchema = mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    transactionId: {
      type: String,
      unique: true,
      default: () => shortid.generate(),
      indexed: true,
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
  { timestamps: true, versionKey: false }
);

// Middleware to generate custom transactionId
orderSchema.pre("save", function (next) {
  if (!this.transactionId) {
    this.transactionId = shortid.generate();
  }
  next();
});


const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
