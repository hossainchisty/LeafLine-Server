// Basic Lib Imports
const express = require("express");
const router = express.Router();

const dashboard = require("../controllers/analyticsController");

const { authMiddleware } = require("../middleware/authMiddleware");

// Routing Implement
router.get("/", dashboard);

module.exports = router;
