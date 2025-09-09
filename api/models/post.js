// models/post.js
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Clerk ID
      required: true,
    },
    caption: {
      type: String,
      required: true,
      trim: true,
    },
    media: [{ type: String }],
    commentsCount: { type: Number, default: 0 }, // <-- add this
    retweets: { type: [String], default: [] }, // ✅ This is required
    createdAt: { type: Date, default: Date.now },
    userName: { type: String },
    firstName: { type: String },
    nickname: { type: String },
    levelType: { type: String, required: true }, // e.g., county, ward, home
    levelValue: { type: String, required: true }, // e.g., Nairobi, Westlands
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
