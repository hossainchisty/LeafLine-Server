// Basic Lib Imports
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressRateLimit = require('express-rate-limit');
const { errorHandler, notFound } = require('./src/middleware/errorMiddleware');


const apis = require('./src/routes/index');

// Database connection with mongoose
require('dotenv').config();
const connectDB = require('./src/config/db');
connectDB();

const app = express();

app.use(helmet());

// log responses to console
app.use(morgan('dev'));

// log all requests to access.log
app.use(
  morgan('common', {
    stream: fs.createWriteStream(path.join(__dirname, '/logs/access.log'), {
      flags: 'a',
    }),
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
const limiter = expressRateLimit({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  message: 'Too many requests',
  standartHeaders: true,
  legacyHeaders: false,
});
app.use(express.json({ limit: limiter }));
app.use(cors('*'));

// // Define an array of allowed origins
// const allowedOrigins = [
//   `http://localhost:5173`,
//   `https://leafline-admin.vercel.app/`,
//   `https://leafline.vercel.app/`,
//   // Add more domains as needed
// ];

// // Configure CORS with the allowed origins
// app.use(cors({
//   origin: function (origin, callback) {
//     // Check if the origin is in the list of allowed origins or if it's undefined (for same-origin requests)
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true); // Allow the request
//     } else {
//       callback(new Error('Not allowed by CORS')); // Deny the request
//     }
//   },
//   credentials: true,
// }));

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use('/api/v1/', apis);

app.use('/', (req, res) => {
  res
    .status(200)
    .json({ statusCode: 200, success: true, message: 'Health OK' });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
