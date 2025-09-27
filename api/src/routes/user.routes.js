// routes/user.routes.js
const express = require("express");
const dotenv = require("dotenv");
const User = require("../models/user"); // no .js extension needed in CommonJS
const { StreamChat } = require("stream-chat");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

const chatServer = StreamChat.getInstance(
  process.env.STREAM_CHAT_KEY,
  process.env.STREAM_CHAT_SECRET
);

const STREAM_VIDEO_API = "https://video.stream-io-api.com/video/v1";
const STREAM_VIDEO_KEY = process.env.STREAM_VIDEO_KEY;
const STREAM_VIDEO_SECRET = process.env.STREAM_VIDEO_SECRET;


// ------------------- CREATE OR UPDATE USER -------------------
router.post("/create-user", async (req, res) => {
  try {
    const {
      clerkId,
      email,
      firstName,
      lastName,
      image,
      nickName,
      provider,
      accountType,
    } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({ message: "Missing clerkId or email" });
    }

    let user = await User.findOne({ clerkId });

    if (user) {
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (nickName) user.nickName = nickName;
      if (image) user.image = image;
      if (provider) user.provider = provider;
      if (accountType) user.accountType = accountType;

      await user.save();
      return res
        .status(200)
        .json({ success: true, user, message: "User updated" });
    }

    user = await User.create({
      clerkId,
      email,
      firstName: firstName || "",
      lastName: lastName || "",
      nickName: nickName || "",
      image: image || "",
      provider: provider || "clerk",
      accountType: accountType || "Personal Account",
    });

    res.status(201).json({ success: true, user, message: "User created" });
  } catch (err) {
    console.error("Error creating/updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// --- Helper: Create video token ---
const createVideoToken = async (userId) => {
  const resp = await axios.post(
    `${STREAM_VIDEO_API}/tokens`,
    { user_id: userId },
    { auth: { username: STREAM_VIDEO_KEY, password: STREAM_VIDEO_SECRET } }
  );
  return resp.data.token;
};

// ------------------- CREATE OR GET USER + STREAM TOKENS -------------------
router.post("/create-or-get-user", async (req, res) => {
  try {
    const { clerkId, email, firstName, lastName, nickName, image } = req.body;

    if (!email || !firstName) {
      return res.status(400).json({ message: "Missing email or firstName" });
    }

    // --- Find or create local user ---
    let user = await User.findOne({ email });
    if (!user) {
      const id = clerkId || `user_${Date.now()}`;
      user = new User({
        clerkId: id,
        email,
        firstName,
        lastName: lastName || "",
        nickName: nickName || "",
        image: image || "",
      });
      await user.save();
    }

    // --- Upsert user in Stream ---
    await chatServer.upsertUser({
      id: user.clerkId,
      name: user.firstName,
      image: image || undefined,
    });

    // --- Generate tokens ---
    const chatToken = chatServer.createToken(user.clerkId);
    const videoToken = await createVideoToken(user.clerkId);

    res.json({ user, chatToken, videoToken });
  } catch (err) {
    console.error("Error in create-or-get-user:", err);
    res.status(500).json({ message: "Server error", error: err.message });
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

// ------------------- FOLLOW -------------------
router.post("/:userId/follow/:targetId", async (req, res) => {
  try {
    const { userId, targetId } = req.params;

    if (userId === targetId) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const user = await User.findById(userId);
    const target = await User.findById(targetId);

    if (!user || !target) {
      return res.status(404).json({ error: "User not found" });
    }

    // prevent duplicate follows
    if (!target.followers.includes(userId)) {
      target.followers.push(userId);
      await target.save();
    }

    res.json({ success: true, target });
  } catch (error) {
    console.error("Error following:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------- UNFOLLOW -------------------
router.post("/:userId/unfollow/:targetId", async (req, res) => {
  try {
    const { userId, targetId } = req.params;

    const target = await User.findById(targetId);
    if (!target) {
      return res.status(404).json({ error: "Target user not found" });
    }

    target.followers = target.followers.filter((id) => id.toString() !== userId);
    await target.save();

    res.json({ success: true, target });
  } catch (error) {
    console.error("Error unfollowing:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------- GET ALL USERS -------------------
router.get("/", async (req, res) => {
  try {
    const { currentUserId } = req.query;

    if (!currentUserId) {
      return res.status(400).json({ error: "currentUserId is required" });
    }

    // Get current user by clerkId
    const currentUser = await User.findOne({ clerkId: currentUserId });

    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found" });
    }

    // Fetch all users
    const users = await User.find({});

    // Attach isFollowing flag
    const data = users.map((u) => ({
      _id: u._id,
      clerkId: u.clerkId,
      firstName: u.firstName,
      lastName: u.lastName,
      nickName: u.nickName,
      image: u.image,
      accountType: u.accountType,
      followers: u.followers,
      following: u.following,
      isFollowing: currentUser.following.some(
        (id) => id.toString() === u._id.toString()
      ),
    }));

    res.json(data);
  } catch (err) {
    console.error("Error fetching members:", err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
