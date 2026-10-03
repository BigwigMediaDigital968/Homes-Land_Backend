const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");

// Approve a Sell entry
router.post("/login", authController.login);

module.exports = router;
