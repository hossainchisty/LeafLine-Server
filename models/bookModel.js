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
      indexedDB: true,
      required: [true, "Please add a text value"],
    }, 
    description: {
      type: String,
      trim: true,
      required: [false, "Please add a text value"],
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
      indexedDB: true,
    },
    rating: {
      type: Number,
      required: false,
      trim: true,
    },
    featured: {
      type: Boolean,
      required: false,
      indexedDB: true,
    },
    read: { type: Number },
    publishYear: {
      type: Number,
      required: false,
    },
    publishDate: {
      type: Number,
      required: false,
    },
    ISBN: {
      type: String,
      required: false,
    },
    language: { type: String, required : true },
    pages: { type: String, required : true},
    publisher: { type: String, required : true},
  },
  { timestamps: true, versionKey: false },
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
