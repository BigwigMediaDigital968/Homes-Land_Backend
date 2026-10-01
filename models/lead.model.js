const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  purpose: String,
  propertyType: { type: String, trim: true },
  size: { type: String, trim: true }, // e.g. "3 BHK"
  budget: { type: String, trim: true }, // a range label, e.g. "₹1 Cr – ₹2 Cr"
  message: String,
  source: {
    type: String,
    enum: ["website", "whatsapp", "phone", "email", "facebook", "instagram", "google-ads", "referral", "walk-in", "other"],
    default: "website",
  },
  origin: {
    kind: { type: String, enum: ["property", "page"] },
    name: { type: String, trim: true },
  },
  status: {
    type: String,
    enum: ["new", "contacted", "qualified", "closed", "lost"],
    default: "new",
  },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Lead", leadSchema);
