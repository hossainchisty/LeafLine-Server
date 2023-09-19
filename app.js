// Basic Lib Imports
const express = require("express"); // Importing the Express framework for building web applications
const helmet = require("helmet"); // Importing Helmet middleware for securing HTTP headers
const bodyParser = require("body-parser"); // Importing Body Parser middleware for parsing request bodies
const cookieParser = require("cookie-parser"); // Importing Cookie Parser middleware for parsing cookies
require("dotenv").config(); // Loading environment variables from .env file
const cors = require("cors"); // Importing CORS middleware for enabling Cross-Origin Resource Sharing
const { errorHandler } = require("./middleware/errorMiddleware"); // Importing custom error handling middleware

const bookRouters = require("./routes/bookRouters");
const userRouters = require("./routes/userRouters");
const cartRouters = require("./routes/cartRouters");
const analyticsRouters = require("./routes/analyticsRouters");
const wishlistRouters = require("./routes/wishlistRouters");

// Database connection with mongoose
const connectDB = require("./config/db"); // Importing database connection function using Mongoose
connectDB(); // Establishing the database connection

const app = express(); // Creating an instance of the Express application
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
// app.use(cors({ origin: "" }));

// Define an array of allowed origins
const allowedOrigins = [
  `http://localhost:5173`,
  `https://leafline-admin.vercel.app/`,
  `https://leafline.vercel.app/`,
  // Add more domains as needed
];

// Configure CORS with the allowed origins
app.use(cors({
  origin: function (origin, callback) {
    // Check if the origin is in the list of allowed origins or if it's undefined (for same-origin requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Deny the request
    }
  },
  credentials: true,
}));

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use("/api/v1/users", userRouters);
app.use("/api/v1/books", bookRouters);
app.use("/api/v1/cart", cartRouters);
app.use("/api/v1/wishlist", wishlistRouters);
app.use("/api/v1/analytics", analyticsRouters);

app.use("/", (req, res) => {
  res.status(200).json({ status: 200, message: "Health OK" });
});

app.use("*", (req, res) => {
  res.status(404).json({ status: 404, message: "Not Found" });
});

app.use(errorHandler);

module.exports = app;
