const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String },
    firstName: { type: String },
    nickname: { type: String },
    caption: { type: String },
    media: [{ type: String }], // array of image/video URLs
    likes: [{ type: String }], // optional for reactions
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Status", statusSchema);

