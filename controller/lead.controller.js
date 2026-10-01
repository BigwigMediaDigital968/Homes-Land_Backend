const Lead = require("../models/lead.model");

// Create a new lead
exports.createLead = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      message,
      purpose,
      propertyType,
      size,
      budget,
      source,
      origin,
    } = req.body;

    if (!name || !email || !phone || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Name, email, phone and message are required." });
    }

    // One enquiry per email per 24 hours (emails are stored lowercased)
    const recentLead = await Lead.exists({
      email: email.trim().toLowerCase(),
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });
    if (recentLead) {
      return res.status(429).json({
        success: false,
        message:
          "We've already received an enquiry from this email in the last 24 hours. Our team will be in touch soon.",
      });
    }

    const lead = new Lead({
      name,
      email,
      phone,
      message: message.trim(),
      purpose: purpose?.trim(),
      propertyType: propertyType || undefined,
      size: size || undefined,
      budget: budget || undefined,
      source: source || "website",
      origin: origin || { kind: "page", name: "contact" },
    });
    await lead.save();
    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update a lead's status
exports.updateLeadStatus = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete a lead by ID
exports.deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
