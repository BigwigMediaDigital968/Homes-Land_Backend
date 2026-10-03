const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../middleware/auth.middleware");
const sellController = require("../controller/AdminApproval");

// Approve a Sell entry
router.post("/approve/:id", requireAdmin, sellController.approveSell);

module.exports = router;
