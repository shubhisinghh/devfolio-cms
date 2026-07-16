const express = require("express");
const fs = require("fs");
const path = require("path");
const { body, validationResult } = require("express-validator");
const db = require("../db/database");
const { requireAuth } = require("../middleware/auth");
const { uploadProjectImage } = require("../middleware/upload");

const router = express.Router();

function serialize(project) {
  return {
    ...project,
    technologies: JSON.parse(project.technologies || "[]"),
    featured: !!project.featured,
  };
}

// GET /api/projects  (public) - supports ?search= & ?category=
router.get("/", (req, res) => {
  const { search, category } = req.query;
  let rows = db.prepare("SELECT * FROM projects ORDER BY created_at DESC").all();

  if (category && category !== "All") {
    rows = rows.filter((p) => p.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.technologies.toLowerCase().includes(q)
    );
  }

  res.json(rows.map(serialize));
});

router.get("/:id", (req, res) => {
  const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found." });
  res.json(serialize(project));
});

router.post(
  "/",
  requireAuth,
  uploadProjectImage.single("image"),
  [
    body("title").notEmpty().withMessage("Title is required."),
    body("description").notEmpty().withMessage("Description is required."),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const { title, description, technologies, github_link, demo_link, category, featured } = req.body;
    const image = req.file ? `/uploads/projects/${req.file.filename}` : null;

    let techArray = [];
    try {
      techArray = technologies ? JSON.parse(technologies) : [];
    } catch {
      techArray = String(technologies || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const info = db
      .prepare(
        `INSERT INTO projects (title, description, image, technologies, github_link, demo_link, category, featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        title,
        description,
        image,
        JSON.stringify(techArray),
        github_link || "",
        demo_link || "",
        category || "Web",
        featured === "true" || featured === true ? 1 : 0
      );

    const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(info.lastInsertRowid);
    res.status(201).json(serialize(project));
  }
);

router.put("/:id", requireAuth, uploadProjectImage.single("image"), (req, res) => {
  const existing = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Project not found." });

  const { title, description, technologies, github_link, demo_link, category, featured } = req.body;

  let techArray = existing.technologies;
  if (technologies !== undefined) {
    try {
      techArray = JSON.stringify(JSON.parse(technologies));
    } catch {
      techArray = JSON.stringify(
        String(technologies)
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      );
    }
  }

  let image = existing.image;
  if (req.file) {
    if (existing.image) {
      const oldPath = path.join(__dirname, "..", existing.image.replace("/uploads", "uploads"));
      fs.unlink(oldPath, () => {});
    }
    image = `/uploads/projects/${req.file.filename}`;
  }

  db.prepare(
    `UPDATE projects SET title=?, description=?, image=?, technologies=?, github_link=?, demo_link=?, category=?, featured=? WHERE id=?`
  ).run(
    title ?? existing.title,
    description ?? existing.description,
    image,
    techArray,
    github_link ?? existing.github_link,
    demo_link ?? existing.demo_link,
    category ?? existing.category,
    featured !== undefined ? (featured === "true" || featured === true ? 1 : 0) : existing.featured,
    req.params.id
  );

  const updated = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);
  res.json(serialize(updated));
});

router.delete("/:id", requireAuth, (req, res) => {
  const existing = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Project not found." });

  if (existing.image) {
    const imgPath = path.join(__dirname, "..", existing.image.replace("/uploads", "uploads"));
    fs.unlink(imgPath, () => {});
  }

  db.prepare("DELETE FROM projects WHERE id = ?").run(req.params.id);
  res.json({ message: "Project deleted." });
});

module.exports = router;
