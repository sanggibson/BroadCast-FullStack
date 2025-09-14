// routes/user.routes.js
const express = require("express");
const dotenv = require("dotenv");
const User = require("../models/user"); // no .js extension needed in CommonJS

dotenv.config();

const router = express.Router();

// ------------------- CREATE OR UPDATE USER -------------------
router.post("/create-user", async (req, res) => {
  try {
    const { clerkId, email, firstName, lastName, image, nickName, provider } =
      req.body;

    if (!clerkId || !email) {
      return res.status(400).json({ message: "Missing clerkId or email" });
    }

    let user = await User.findOne({ clerkId });

    if (user) {
      // ✅ Update only if fields are provided
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (nickName) user.nickName = nickName;
      if (image) user.image = image;
      if (provider) user.provider = provider;

      await user.save();
      return res
        .status(200)
        .json({ success: true, user, message: "User updated" });
    }

    // ✅ Create new user
    user = await User.create({
      clerkId,
      email,
      firstName: firstName || "",
      lastName: lastName || "",
      nickName: nickName || "",
      image: image || "",
      provider: provider || "clerk",
    });

    res.status(201).json({ success: true, user, message: "User created" });
  } catch (err) {
    console.error("Error creating/updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- UPDATE USER LOCATION -------------------
router.post("/update-location", async (req, res) => {
  try {
    const { clerkId, county, constituency, ward } = req.body;

    if (!clerkId) {
      return res.status(400).json({ error: "clerkId required" });
    }

    const user = await User.findOneAndUpdate(
      { clerkId },
      { county, constituency, ward },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ error: "Server error updating location" });
  }
});

// ------------------- GET USER BY CLERKID -------------------
router.get("/:clerkId", async (req, res) => {
  try {
    const { clerkId } = req.params;
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- UPDATE USER IMAGE -------------------
router.post("/update-image", async (req, res) => {
  try {
    const { clerkId, image } = req.body;
    if (!clerkId || !image) {
      return res.status(400).json({ error: "clerkId and image are required" });
    }

    const user = await User.findOneAndUpdate(
      { clerkId },
      { image },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("Error updating profile image:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
