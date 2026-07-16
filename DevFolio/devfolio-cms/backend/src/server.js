require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

require("./db/database"); // ensures DB + tables are initialized

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const blogRoutes = require("./routes/blogs");
const messageRoutes = require("./routes/messages");
const profileRoutes = require("./routes/profile");
const resumeRoutes = require("./routes/resume");
const statsRoutes = require("./routes/stats");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Devfolio API is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/stats", statsRoutes);

// 404 handler for unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ error: "This API route does not exist." });
});

// Centralized error handler (catches multer errors etc.)
app.use((err, req, res, next) => {
  console.error(err);
  if (err.message) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`Devfolio API listening on http://localhost:${PORT}`);
});
