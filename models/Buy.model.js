const mongoose = require("mongoose");
const { PROPERTY_TYPES } = require("../constants/propertyTypes");

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true }, // SEO-friendly URL
  description: { type: String, default: "" }, // optional
  metaTitle: { type: String, default: "" }, 
  metaDescription: { type: String, default: "" }, 
  purpose: {
    type: String,
    enum: ["Buy", "Sell", "Rent", "Upcoming"],
    required: true,
  },
  type: { type: String, enum: PROPERTY_TYPES, required: true },
  location: { type: String, required: true },

  images: { type: [String], default: [] }, // URLs or Cloudinary links

  price: { type: Number, default: null }, // optional
  bedrooms: { type: Number, default: null },
  bathrooms: { type: Number, default: null },
  areaSqft: { type: Number, default: null },

  highlights: { type: [String], default: [] },
  featuresAmenities: { type: [String], default: [] },
  nearby: { type: [String], default: [] },

  googleMapUrl: { type: String, default: "" },
  videoLink: { type: String, default: "" },
  extraHighlights: { type: [String], default: [] },

  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Property", propertySchema);
