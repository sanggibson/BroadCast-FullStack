const mongoose = require("mongoose");
const { Schema } = mongoose;

// ------------------- Reply Schema -------------------
const replySchema = new Schema(
  {
    userId: { type: String, required: true }, // Clerk ID
    userName: { type: String, required: true },
    text: { type: String, required: true },
    likes: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true } // 👈 ensures replies have unique _id
);

// ------------------- Comment Schema -------------------
const commentSchema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
    userId: { type: String, required: true }, // Clerk ID
    userName: { type: String, required: true },
    text: { type: String, required: true },
    likes: { type: [String], default: [] },
    replies: { type: [replySchema], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

module.exports = Comment;
