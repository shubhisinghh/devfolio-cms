const express = require("express");
const fs = require("fs");
const path = require("path");
const db = require("../db/database");
const { requireAuth } = require("../middleware/auth");
const { uploadResume } = require("../middleware/upload");

const router = express.Router();

router.get("/", (req, res) => {
  const profile = db.prepare("SELECT resume_file, resume_original_name, resume_uploaded_at FROM profile WHERE id = 1").get();
  if (!profile || !profile.resume_file) {
    return res.status(404).json({ error: "No resume has been uploaded yet." });
  }
  res.json(profile);
});

router.get("/download", (req, res) => {
  const profile = db.prepare("SELECT resume_file, resume_original_name FROM profile WHERE id = 1").get();
  if (!profile || !profile.resume_file) {
    return res.status(404).json({ error: "No resume has been uploaded yet." });
  }

  db.prepare(
    "UPDATE stats SET resume_downloads = resume_downloads + 1 WHERE id = 1"
  ).run();

  const filePath = path.join(__dirname, "..", profile.resume_file.replace("/uploads", "uploads"));
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Resume file is missing on the server." });
  }

  res.download(filePath, profile.resume_original_name || "resume.pdf");
});

router.post("/", requireAuth, uploadResume.single("resume"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No resume file was uploaded." });

  const existing = db.prepare("SELECT resume_file FROM profile WHERE id = 1").get();
  if (existing && existing.resume_file) {
    const oldPath = path.join(__dirname, "..", existing.resume_file.replace("/uploads", "uploads"));
    fs.unlink(oldPath, () => {});
  }

  const resumeFile = `/uploads/resume/${req.file.filename}`;
  db.prepare(
    "UPDATE profile SET resume_file = ?, resume_original_name = ?, resume_uploaded_at = datetime('now') WHERE id = 1"
  ).run(resumeFile, req.file.originalname);

  res.status(201).json({ message: "Resume uploaded successfully.", resume_file: resumeFile });
});

module.exports = router;
