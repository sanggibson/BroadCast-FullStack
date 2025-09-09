// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    nickName: { type: String, unique: true },
    image: { type: String },

    // 🟢 New fields for IEBC Location
    county: { type: String },
    constituency: { type: String },
    ward: { type: String },

    
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
