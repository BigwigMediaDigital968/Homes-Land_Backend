const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../middleware/auth.middleware");
const {
  createContact,
  getContacts,
  deleteContact,
} = require("../controller/contact.controller");

// POST /api/contacts - create a new contact
router.post("/", createContact);

// GET /api/contacts - get all contacts
router.get("/", requireAdmin, getContacts);

// DELETE /api/contacts/:id - delete a contact by ID
router.delete("/:id", requireAdmin, deleteContact);

module.exports = router;
