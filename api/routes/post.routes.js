// routes/postRoutes.js
const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/user"); // your user model

// Create a post
// routes/postRoutes.js
// Create a post
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      caption,
      media,
      userName,
      firstName,
      nickname,
      levelType,
      levelValue,
    } = req.body;

    if (!userId || !caption) {
      return res.status(400).json({ message: "UserId and caption required" });
    }

    const newPost = await Post.create({
      userId,
      userName,
      firstName,
      nickname,
      caption,
      media: media || [],
      levelType,
      levelValue,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Fetch posts (optionally filter by level)
router.get("/", async (req, res) => {
  try {
    const { levelType, levelValue } = req.query;

    let filter = {};
    if (levelType && levelValue) {
      filter = { levelType, levelValue };
    }

    const posts = await Post.find(filter)
      .populate("userId", "userName firstName nickname imageUrl")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:postId/like", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const index = post.likes.indexOf(userId);

    if (index === -1) {
      // User hasn't liked yet → add like
      post.likes.push(userId);
    } else {
      // User has liked → remove like (unlike)
      post.likes.splice(index, 1);
    }

    await post.save();

    res.json({ success: true, likes: post.likes.length, liked: index === -1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// routes/postRoutes.js
router.post("/:postId/retweet", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, userName } = req.body; // Make sure you destructure userId!

    if (!userId) return res.status(400).json({ message: "userId is required" });

    const originalPost = await Post.findById(postId);
    if (!originalPost)
      return res.status(404).json({ message: "Post not found" });

    // Optional: prevent duplicate retweets by the same user
    const alreadyRetweeted = await Post.findOne({
      originalPostId: postId,
      userId,
    });
    if (alreadyRetweeted)
      return res.status(400).json({ message: "Already retweeted" });

    // Create new post for retweet
    const retweet = await Post.create({
      userId,
      userName,
      caption: originalPost.caption,
      media: originalPost.media,
      originalPostId: postId, // reference
      retweetOf: originalPost.userName, // optional label
      levelType: originalPost.levelType,
      levelValue: originalPost.levelValue,
    });

    res.status(201).json(retweet);
  } catch (err) {
    console.error("Error retweeting post:", err);
    res.status(500).json({ message: "Server error" });
  }
});






module.exports = router;
