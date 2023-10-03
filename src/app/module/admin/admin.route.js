// Basic Lib Imports
const express = require("express");
const router = express.Router();

const dashboard = require("./admin.controller");

const { authMiddleware } = require("../../middleware/authMiddleware");

// Routing Implement
router.get("/", authMiddleware, dashboard);

module.exports = router;

