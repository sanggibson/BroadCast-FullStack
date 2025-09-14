// routes/postRoutes.js
const express = require("express");
const { requireAuth } = require("@clerk/express");
const Post = require("../models/post");
const User = require("../models/user");

const router = express.Router();

// ------------------- Create a Post -------------------
router.post("/", async (req, res) => {
  try {
    const { userId, caption, media, levelType, levelValue } = req.body;

    if (!userId || !caption) {
      return res.status(400).json({ message: "UserId and caption required" });
    }

    const newPost = await Post.create({
      userId,
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

// ------------------- Fetch Posts (with optional filters) -------------------
router.get("/", async (req, res) => {
  try {
    const { levelType, levelValue } = req.query;

    let filter = {};
    if (levelType && levelValue) {
      filter = { levelType, levelValue };
    }

    const posts = await Post.find(filter).sort({ createdAt: -1 }).lean();

    if (!posts.length) return res.json([]);

    // collect Clerk IDs
    const clerkIds = posts.map((p) => p.userId).filter(Boolean);

    // fetch matching users
    const users = await User.find({ clerkId: { $in: clerkIds } }).lean();

    // map clerkId -> user info
    const userMap = {};
    users.forEach((u) => {
      userMap[u.clerkId] = {
        nickName: u.nickName || u.firstName || "Anonymous",
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        image: u.image || null,
      };
    });

    // attach user info to posts
    const postsWithUser = posts.map((post) => ({
      ...post,
      user: userMap[post.userId] || {
        nickName: "Anonymous",
        firstName: "",
        lastName: "",
        image: null,
      },
    }));

    res.json(postsWithUser);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- Like a Post -------------------
router.post("/:postId/like", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const index = post.likes.findIndex((id) => id.toString() === userId);

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();

    res.json({ success: true, likes: post.likes.length, liked: index === -1 });
  } catch (err) {
    console.error("Error liking post:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- Retweet a Post -------------------
router.post("/:postId/retweet", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, userName } = req.body;

    if (!userId) return res.status(400).json({ message: "userId is required" });

    const originalPost = await Post.findById(postId).lean();
    if (!originalPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyRetweeted = await Post.findOne({
      originalPostId: postId,
      userId,
    });

    if (alreadyRetweeted) {
      return res.status(400).json({ message: "Already retweeted" });
    }

    const retweet = await Post.create({
      userId,
      userName,
      caption: originalPost.caption,
      media: originalPost.media,
      originalPostId: postId,
      retweetOf: originalPost.userName || "Unknown",
      levelType: originalPost.levelType,
      levelValue: originalPost.levelValue,
    });

    res.status(201).json(retweet);
  } catch (err) {
    console.error("Error retweeting post:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- Delete a Post -------------------
router.delete("/:id", requireAuth(), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Clerk auth object is available on req.auth
    if (post.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Server error", err });
  }
});

module.exports = router;
