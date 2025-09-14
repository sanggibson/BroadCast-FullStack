// routes/stream.routes.js
const express = require("express");
const { StreamChat } = require("stream-chat");
require("dotenv").config();

const router = express.Router();

// ✅ Stream Chat token route
router.get("/stream-token/:userId/:username", async (req, res) => {
  try {
    const { userId, username } = req.params;

    if (!process.env.STREAM_API_KEY || !process.env.STREAM_API_SECRET) {
      return res.status(500).json({ error: "Stream API credentials missing" });
    }

    const serverClient = StreamChat.getInstance(
      process.env.STREAM_API_KEY,
      process.env.STREAM_API_SECRET
    );

    // Generate a Stream Chat token for the user
    const token = serverClient.createToken(userId);

    res.json({ token });
  } catch (err) {
    console.error("Stream token error:", err);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

module.exports = router;
