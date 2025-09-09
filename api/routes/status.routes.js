const express = require("express");
const router = express.Router();
const Status = require("../models/status");

// Create a new status
router.post("/", async (req, res) => {
  try {
    const { userId, caption, media, userName, firstName, nickname } = req.body;

    // Validate required fields
    if (!userId || (!caption && (!media || media.length === 0))) {
      return res
        .status(400)
        .json({ message: "userId and either caption or media required" });
    }

    // Determine the display name
    let displayName = "Anonymous"; // default
    if (firstName && firstName.trim() !== "") displayName = firstName.trim();
    else if (userName && userName.trim() !== "") displayName = userName.trim();
    else if (nickname && nickname.trim() !== "") displayName = nickname.trim();

    // Create new status
    const newStatus = new Status({
      userId,
      caption: caption || "",
      media: Array.isArray(media) ? media : [],
      userName: displayName,
    });

    const savedStatus = await newStatus.save();
    res.status(201).json(savedStatus);
  } catch (err) {
    console.error("Error creating status:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all statuses
router.get("/", async (req, res) => {
  try {
    const statuses = await Status.find().sort({ createdAt: -1 });
    res.status(200).json(statuses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
