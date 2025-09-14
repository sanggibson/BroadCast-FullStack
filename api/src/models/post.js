// models/post.js
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Clerk ID
    caption: { type: String, required: true, trim: true },
    media: [{ type: String }],
    commentsCount: { type: Number, default: 0 },
    retweets: { type: [String], default: [] },
    levelType: { type: String, required: true },
    levelValue: { type: String, required: true },
    likes: { type: [String], default: [] }, // Clerk IDs, not ObjectIds
    comments: [
      {
        userId: { type: String, required: true },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    originalPostId: { type: String, default: null },
    retweetOf: { type: String, default: null },
    userName: { type: String }, // optional
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
