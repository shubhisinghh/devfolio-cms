const express = require("express");
const db = require("../db/database");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/visit", (req, res) => {
  db.prepare("UPDATE stats SET visitor_count = visitor_count + 1 WHERE id = 1").run();
  const stats = db.prepare("SELECT visitor_count FROM stats WHERE id = 1").get();
  res.json(stats);
});

router.get("/", (req, res) => {
  const stats = db.prepare("SELECT * FROM stats WHERE id = 1").get();
  res.json(stats);
});

// Dashboard summary — admin only
router.get("/dashboard", requireAuth, (req, res) => {
  const totalProjects = db.prepare("SELECT COUNT(*) as c FROM projects").get().c;
  const totalBlogs = db.prepare("SELECT COUNT(*) as c FROM blogs").get().c;
  const totalMessages = db.prepare("SELECT COUNT(*) as c FROM messages").get().c;
  const unreadMessages = db.prepare("SELECT COUNT(*) as c FROM messages WHERE is_read = 0").get().c;
  const { visitor_count, resume_downloads } = db.prepare("SELECT * FROM stats WHERE id = 1").get();

  res.json({
    totalProjects,
    totalBlogs,
    totalMessages,
    unreadMessages,
    visitorCount: visitor_count,
    resumeDownloads: resume_downloads,
  });
});

module.exports = router;
