const mongoose = require("mongoose") ;

// Book Schema Definition

const bookSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please add a text value"],
    },
    thumbnail: {
      type: String,
    },
    price: { type: Number, required: true},
    author: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: false,
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
