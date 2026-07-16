const express = require("express");
const fs = require("fs");
const path = require("path");
const db = require("../db/database");
const { requireAuth } = require("../middleware/auth");
const { uploadProfilePhoto } = require("../middleware/upload");

const router = express.Router();

function serialize(p) {
  return { ...p, skills: JSON.parse(p.skills || "[]") };
}

router.get("/", (req, res) => {
  const profile = db.prepare("SELECT * FROM profile WHERE id = 1").get();
  res.json(serialize(profile));
});

router.put("/", requireAuth, uploadProfilePhoto.single("photo"), (req, res) => {
  const existing = db.prepare("SELECT * FROM profile WHERE id = 1").get();
  const { name, title, bio, about, email, location, github, linkedin, twitter, website, skills } = req.body;

  let photo = existing.photo;
  if (req.file) {
    if (existing.photo) {
      const oldPath = path.join(__dirname, "..", existing.photo.replace("/uploads", "uploads"));
      fs.unlink(oldPath, () => {});
    }
    photo = `/uploads/profile/${req.file.filename}`;
  }

  let skillsArray = existing.skills;
  if (skills !== undefined) {
    try {
      skillsArray = JSON.stringify(JSON.parse(skills));
    } catch {
      skillsArray = JSON.stringify(
        String(skills)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      );
    }
  }

  db.prepare(
    `UPDATE profile SET name=?, title=?, bio=?, about=?, photo=?, email=?, location=?, github=?, linkedin=?, twitter=?, website=?, skills=? WHERE id=1`
  ).run(
    name ?? existing.name,
    title ?? existing.title,
    bio ?? existing.bio,
    about ?? existing.about,
    photo,
    email ?? existing.email,
    location ?? existing.location,
    github ?? existing.github,
    linkedin ?? existing.linkedin,
    twitter ?? existing.twitter,
    website ?? existing.website,
    skillsArray
  );

  const updated = db.prepare("SELECT * FROM profile WHERE id = 1").get();
  res.json(serialize(updated));
});

module.exports = router;
