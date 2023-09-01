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
    cover: {
      type: String,
    },
    author: {
      type: String,
      required: true,
    },
    read: { type: Number },
    publishYear: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
