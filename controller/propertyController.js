const Property = require("../models/Buy.model");

// @desc    Create a new property with images
// @route   POST /api/properties
// @access  Public or Admin

exports.createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      purpose,
      type,
      location,
      price,
      bedrooms,
      bathrooms,
      areaSqft,
      highlights,
      featuresAmenities,
      nearby,
      googleMapUrl,
      videoLink,
      extraHighlights,
    } = req.body;

    // Handle uploaded images from Cloudinary
    const images = req.files ? req.files.map((file) => file.path) : [];

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    // Convert numeric fields safely (empty string → null)
    const toNumberOrNull = (value) => {
      if (value === "" || value === undefined) return null;
      const num = Number(value);
      return isNaN(num) ? null : num;
    };

    const property = new Property({
      title,
      slug,
      description: description || "", // if empty, fallback ""
      purpose,
      type,
      location,
      price: toNumberOrNull(price),
      bedrooms: toNumberOrNull(bedrooms),
      bathrooms: toNumberOrNull(bathrooms),
      areaSqft: toNumberOrNull(areaSqft),

      highlights: highlights ? JSON.parse(highlights) : [],
      featuresAmenities: featuresAmenities ? JSON.parse(featuresAmenities) : [],
      nearby: nearby ? JSON.parse(nearby) : [],
      googleMapUrl: googleMapUrl || "",
      videoLink: videoLink || "",
      extraHighlights: extraHighlights ? JSON.parse(extraHighlights) : [],

      images,
    });

    await property.save();
    res.status(201).json(property);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to create property", error });
  }
};

// @desc    Get all properties (optionally filtered by ?category=buy|rent|upcoming|sell)
// @route   GET /property
// @route   GET /property?category=rent
// @access  Public
exports.getProperties = async (req, res) => {
  try {
    // Map URL-friendly category → model's purpose enum value
    const categoryMap = {
      buy: "Buy",
      rent: "Rent",
      upcoming: "Upcoming",
      sell: "Sell",
    };

    const filter = {};
    if (req.query.category) {
      const purpose = categoryMap[req.query.category.toLowerCase()];
      if (purpose) {
        filter.purpose = { $regex: new RegExp(`^${purpose}$`, "i") };
      }
    }

    const properties = await Property.find(filter).sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch properties", error });
  }
};

// @desc    Get single property by slug
// @route   GET /api/properties/:slug
// @access  Public
exports.getPropertyBySlug = async (req, res) => {
  try {
    const property = await Property.findOne({ slug: req.params.slug });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch property", error });
  }
};

// controllers/propertyController.js
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({ slug: req.params.slug });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete property", error });
  }
};

// @desc    Update a property by slug (partial update)
// @route   PATCH /api/properties/:slug
// @access  Admin
exports.updateProperty = async (req, res) => {
  try {
    const existing = await Property.findOne({ slug: req.params.slug });
    if (!existing) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Parse existingImages coming from frontend (these are the ones to keep)
    let images = existing.images;
    if (req.body.existingImages) {
      images = JSON.parse(req.body.existingImages);
    }

    // Append new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);
      images = [...images, ...newImages];
    }

    // Generate slug if title updated
    let slug = existing.slug;
    if (req.body.title) {
      slug = req.body.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
    }

    const updatedFields = {
      title: req.body.title ?? existing.title,
      slug,
      description: req.body.description ?? existing.description,
      purpose: req.body.purpose ?? existing.purpose,
      type: req.body.type ?? existing.type,
      location: req.body.location ?? existing.location,
      price:
        req.body.price !== undefined ? Number(req.body.price) : existing.price,
      bedrooms:
        req.body.bedrooms !== undefined
          ? Number(req.body.bedrooms)
          : existing.bedrooms,
      bathrooms:
        req.body.bathrooms !== undefined
          ? Number(req.body.bathrooms)
          : existing.bathrooms,
      areaSqft:
        req.body.areaSqft !== undefined
          ? Number(req.body.areaSqft)
          : existing.areaSqft,
      highlights: req.body.highlights
        ? JSON.parse(req.body.highlights)
        : existing.highlights,
      featuresAmenities: req.body.featuresAmenities
        ? JSON.parse(req.body.featuresAmenities)
        : existing.featuresAmenities,
      nearby: req.body.nearby ? JSON.parse(req.body.nearby) : existing.nearby,
      googleMapUrl: req.body.googleMapUrl ?? existing.googleMapUrl,
      videoLink: req.body.videoLink ?? existing.videoLink,
      extraHighlights: req.body.extraHighlights
        ? JSON.parse(req.body.extraHighlights)
        : existing.extraHighlights,

      images, // now updated properly
      lastUpdated: Date.now(),
    };

    const property = await Property.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: updatedFields },
      { new: true }
    );

    res.status(200).json(property);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to update property", error });
  }
};
