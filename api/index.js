require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://techredant_db_user:nwkgRTJRS2nIyAtl@broadcast.wdd2jky.mongodb.net/"
  )
  .then(() => console.log("Database connected successfully!"))
  .catch((err) => console.log("Error connecting to database!", err));

const userRoutes = require("./routes/user.routes");
app.use("/api/users", userRoutes);

const postRoutes = require("./routes/post.routes");
app.use("/api/posts", postRoutes);

const commentRoutes = require("./routes/comment.routes");
app.use("/api/comments", commentRoutes);

const statusRoutes = require("./routes/status.routes");
app.use("/api/statuses", statusRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
