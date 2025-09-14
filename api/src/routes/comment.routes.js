// routes/commentRoutes.js
const express = require("express");
const Comment = require("../models/comment");
const Post = require("../models/post");

const router = express.Router();

// ------------------- Create a Comment -------------------
router.post("/", async (req, res) => {
  try {
    const { postId, userId, userName, text } = req.body;

    if (!postId || !userId || !text) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newComment = await Comment.create({
      postId,
      userId,
      userName,
      text,
      createdAt: new Date(),
    });

    // Increment commentsCount in Post
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    res.status(201).json(newComment);
  } catch (err) {
    console.error("Error creating comment:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- Get all Comments for a Post -------------------
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- Like a Comment -------------------
router.post("/:commentId/like", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter((id) => id !== userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();
    res.json(comment);
  } catch (err) {
    console.error("Error liking comment:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- Like a Reply -------------------
router.post("/:commentId/replies/:replyIndex/like", async (req, res) => {
  try {
    const { commentId, replyIndex } = req.params;
    const { userId } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const reply = comment.replies[parseInt(replyIndex)];
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    if (!reply.likes) reply.likes = [];
    if (reply.likes.includes(userId)) {
      reply.likes = reply.likes.filter((id) => id !== userId);
    } else {
      reply.likes.push(userId);
    }

    await comment.save();
    res.json(comment);
  } catch (err) {
    console.error("Error liking reply:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- Delete a Comment -------------------
router.delete("/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    await Comment.findByIdAndDelete(commentId);
    await Post.findByIdAndUpdate(comment.postId, {
      $inc: { commentsCount: -1 },
    });

    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- Add a Reply -------------------
router.post("/:commentId/reply", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, userName, text } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.replies.push({ userId, userName, text, likes: [] });
    await comment.save();

    res.status(201).json(comment);
  } catch (err) {
    console.error("Error adding reply:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
