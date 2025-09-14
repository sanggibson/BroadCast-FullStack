// index.js
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://techredant_db_user:nwkgRTJRS2nIyAtl@broadcast.wdd2jky.mongodb.net/";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Database connected successfully!"))
  .catch((err) => console.error("❌ Error connecting to database!", err));

// Routes
const userRoutes = require("./src/routes/user.routes");
const postRoutes = require("./src/routes/post.routes");
const commentRoutes = require("./src/routes/comment.routes");
const statusRoutes = require("./src/routes/status.routes");
const productRoutes = require("./src/routes/product.routes");
const categoryRoutes = require("./src/routes/category.routes");
const verifyRoutes = require("./src/routes/verify.routes");
const streamRoutes = require("./src/routes/stream.routes");
const stripeRoutes = require("./src/routes/stripe.routes");

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/statuses", statusRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api", verifyRoutes);
app.use("/api", streamRoutes);
app.use("/api/stripe", stripeRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
