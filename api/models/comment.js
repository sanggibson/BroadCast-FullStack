// models/comment.js
const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  userId: { type: String, required: true }, // you can keep as string to avoid ObjectId issues
  userName: { type: String, required: true },
  text: { type: String, required: true },
  likes: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Post" },
  userId: { type: String, required: true }, // keep as string if using Clerk IDs
  userName: { type: String, required: true },
  text: { type: String, required: true },
  likes: { type: [String], default: [] },
  replies: [
    {
      userId: String,
      userName: String,
      text: String,
      likes: { type: [String], default: [] },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema);
