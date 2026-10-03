const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../middleware/auth.middleware");
const sellController = require("../controller/SellController");
const multer = require("multer");
const storage = require("../config/storage"); // Cloudinary storage

const upload = multer({ storage });

// Create a new sell listing with multiple images
router.post(
  "/addsell",
  upload.array("images", 50), // 'images' is the field name in form-data, max 50 files
  sellController.createSell
);

// Get all sell listings
router.get("/viewsell", requireAdmin, sellController.getSells);

// Get single sell listing by slug
router.get("/:slug", requireAdmin, sellController.getSellBySlug);

// Delete a sell listing by slug
router.delete("/:slug", requireAdmin, sellController.deleteSell);

// Update a sell listing by slug
router.patch("/:slug", requireAdmin, upload.array("images", 50), sellController.updateSell);

module.exports = router;
