const express = require("express");
const router = express.Router();

const {
  getBooks,
  getBookByID,
  getBooksList,
  getBookByTitle,
  addBook,
  updateBook,
  deleteBook,
  searchBook,
} = require("../controllers/bookController");

// API Endpoints for Managing Books
router.get("/list", getBooksList);

router.get("/:title", getBookByTitle);

// Search for books by title
router.get("/search", searchBook);

router.route("/").get(getBooks).post(addBook).put(updateBook);

router.route("/:id").delete(deleteBook).get(getBookByID);

module.exports = router;
