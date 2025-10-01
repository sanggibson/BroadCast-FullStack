// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const express = require("express");
// const cors = require("cors");
// const http = require("http");
// const { Server } = require("socket.io");

// // Load environment variables
// require("dotenv").config();

// const app = express();
// const server = http.createServer(app); // wrap express with http
// const io = new Server(server, {
//   cors: {
//     origin: "*", // allow frontend
//     methods: ["GET", "POST", "DELETE"],
//   },
// });

// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// const MONGO_URI =
//   process.env.MONGO_URI ||
//   "mongodb+srv://techredant_db_user:nwkgRTJRS2nIyAtl@broadcast.wdd2jky.mongodb.net/";

// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log("✅ Database connected successfully!"))
//   .catch((err) => console.error("❌ Error connecting to database!", err));

// // ✅ Attach io to app so routes can use it
// app.set("io", io);

// // ✅ Socket.IO connection handling
// io.on("connection", (socket) => {
//   console.log("🟢 New client connected:", socket.id);

//   socket.on("joinRoom", (room) => {
//     socket.join(room);
//     console.log(`User ${socket.id} joined room: ${room}`);
//   });

//   socket.on("leaveRoom", (room) => {
//     socket.leave(room);
//     console.log(`User ${socket.id} left room: ${room}`);
//   });

//   socket.on("disconnect", () => {
//     console.log("🔴 Client disconnected:", socket.id);
//   });
// });

// // Routes
// const userRoutes = require("./src/routes/user.routes");
// const postRoutes = require("./src/routes/post.routes");
// const commentRoutes = require("./src/routes/comment.routes");
// const statusRoutes = require("./src/routes/status.routes");
// const productRoutes = require("./src/routes/product.routes");
// const categoryRoutes = require("./src/routes/category.routes");
// const verifyRoutes = require("./src/routes/verify.routes");
// const streamRoutes = require("./src/routes/stream.routes");
// const stripeRoutes = require("./src/routes/stripe.routes");
// const newsRoutes = require("./src/routes/news.routes");

// app.use("/api/users", userRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/comments", commentRoutes);
// app.use("/api/statuses", statusRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/categories", categoryRoutes);
// app.use("/api", verifyRoutes);
// app.use("/api/stream", streamRoutes);
// app.use("/api/stripe", stripeRoutes);
// app.use("/api/news", newsRoutes);

// // ✅ Start server with `server.listen` not `app.listen`
// server.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });


const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// Load environment variables
require("dotenv").config();

const app = express();
const server = http.createServer(app); // wrap express with http
const io = new Server(server, {
  cors: {
    origin: "*", // allow frontend
    methods: ["GET", "POST", "DELETE"],
  },
});

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

// ✅ Attach io to app so routes can use it
app.set("io", io);

// ✅ Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    console.log(`User ${socket.id} left room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// Routes
const userRoutes = require("./src/routes/user.routes");
const postRoutes = require("./src/routes/post.routes")(io); // 👈 pass io
const commentRoutes = require("./src/routes/comment.routes");
const statusRoutes = require("./src/routes/status.routes");
const productRoutes = require("./src/routes/product.routes");
const categoryRoutes = require("./src/routes/category.routes");
const verifyRoutes = require("./src/routes/verify.routes");
const streamRoutes = require("./src/routes/stream.routes");
const stripeRoutes = require("./src/routes/stripe.routes");
const newsRoutes = require("./src/routes/news.routes");
// const replyRoutes = require("./src/routes/reply.routes");


app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/statuses", statusRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api", verifyRoutes);
app.use("/api/stream", streamRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/news", newsRoutes);
// app.use("/api/replies", replyRoutes);

// ✅ Start server with LAN binding
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});


// server.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });