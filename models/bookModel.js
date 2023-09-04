const mongoose = require("mongoose");

// Book Schema Definition

const bookSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please add a text value"],
    },
    thumbnail: {
      trim: true,
      type: String,
    },
    price: { type: Number, required: true, trim: true },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: false,
      trim: true,
    },
    featured: {
      type: Boolean,
      required: false,
    },
    read: { type: Number },
    publishYear: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
