// routes/commentRoutes.js
const express = require("express");
const router = express.Router();
const Comment = require("../models/comment"); // Make sure you have a Comment model
const Post = require("../models/post"); // make sure you import Post model

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

    // Increment commentsCount in post
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all comments for a post
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// routes/commentRoutes.js
// routes/commentRoutes.js
router.post("/:commentId/like", async (req, res) => {
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
});


router.post("/:commentId/replies/:replyIndex/like", async (req, res) => {
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
});

// DELETE a comment
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
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// routes/commentRoutes.js

// Add reply to a comment
router.post("/:commentId/reply", async (req, res) => {
  const { commentId } = req.params;
  const { userId, userName, text } = req.body;

  const comment = await Comment.findById(commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });

  comment.replies.push({ userId, userName, text });
  await comment.save();

  res.status(201).json(comment);
});





module.exports = router;
