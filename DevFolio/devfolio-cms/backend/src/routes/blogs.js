const express = require("express");
const fs = require("fs");
const path = require("path");
const { body, validationResult } = require("express-validator");
const db = require("../db/database");
const { requireAuth } = require("../middleware/auth");
const { uploadBlogThumbnail } = require("../middleware/upload");

const router = express.Router();

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readingTime(content) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function serialize(blog) {
  return {
    ...blog,
    tags: JSON.parse(blog.tags || "[]"),
    published: !!blog.published,
    reading_time: readingTime(blog.content),
  };
}

router.get("/", (req, res) => {
  const { search, tag, publishedOnly } = req.query;
  let rows = db.prepare("SELECT * FROM blogs ORDER BY publish_date DESC").all();

  if (publishedOnly !== "false") {
    rows = rows.filter((b) => b.published);
  }
  if (tag) {
    rows = rows.filter((b) => JSON.parse(b.tags || "[]").includes(tag));
  }
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter(
      (b) => b.title.toLowerCase().includes(q) || (b.excerpt || "").toLowerCase().includes(q)
    );
  }

  res.json(rows.map(serialize));
});

router.get("/:slug", (req, res) => {
  const blog = db.prepare("SELECT * FROM blogs WHERE slug = ?").get(req.params.slug);
  if (!blog) return res.status(404).json({ error: "Blog post not found." });

  db.prepare("UPDATE blogs SET views = views + 1 WHERE id = ?").run(blog.id);
  blog.views += 1;

  res.json(serialize(blog));
});

router.post(
  "/",
  requireAuth,
  uploadBlogThumbnail.single("thumbnail"),
  [
    body("title").notEmpty().withMessage("Title is required."),
    body("content").notEmpty().withMessage("Content is required."),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const { title, content, excerpt, tags, published } = req.body;
    const thumbnail = req.file ? `/uploads/blog/${req.file.filename}` : null;

    let baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (db.prepare("SELECT id FROM blogs WHERE slug = ?").get(slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    let tagArray = [];
    try {
      tagArray = tags ? JSON.parse(tags) : [];
    } catch {
      tagArray = String(tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const info = db
      .prepare(
        `INSERT INTO blogs (title, slug, content, excerpt, thumbnail, tags, published)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        title,
        slug,
        content,
        excerpt || content.slice(0, 160),
        thumbnail,
        JSON.stringify(tagArray),
        published === "false" || published === false ? 0 : 1
      );

    const blog = db.prepare("SELECT * FROM blogs WHERE id = ?").get(info.lastInsertRowid);
    res.status(201).json(serialize(blog));
  }
);

router.put("/:id", requireAuth, uploadBlogThumbnail.single("thumbnail"), (req, res) => {
  const existing = db.prepare("SELECT * FROM blogs WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Blog post not found." });

  const { title, content, excerpt, tags, published } = req.body;

  let tagArray = existing.tags;
  if (tags !== undefined) {
    try {
      tagArray = JSON.stringify(JSON.parse(tags));
    } catch {
      tagArray = JSON.stringify(
        String(tags)
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      );
    }
  }

  let thumbnail = existing.thumbnail;
  if (req.file) {
    if (existing.thumbnail) {
      const oldPath = path.join(__dirname, "..", existing.thumbnail.replace("/uploads", "uploads"));
      fs.unlink(oldPath, () => {});
    }
    thumbnail = `/uploads/blog/${req.file.filename}`;
  }

  db.prepare(
    `UPDATE blogs SET title=?, content=?, excerpt=?, thumbnail=?, tags=?, published=? WHERE id=?`
  ).run(
    title ?? existing.title,
    content ?? existing.content,
    excerpt ?? existing.excerpt,
    thumbnail,
    tagArray,
    published !== undefined ? (published === "false" || published === false ? 0 : 1) : existing.published,
    req.params.id
  );

  const updated = db.prepare("SELECT * FROM blogs WHERE id = ?").get(req.params.id);
  res.json(serialize(updated));
});

router.delete("/:id", requireAuth, (req, res) => {
  const existing = db.prepare("SELECT * FROM blogs WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Blog post not found." });

  if (existing.thumbnail) {
    const thumbPath = path.join(__dirname, "..", existing.thumbnail.replace("/uploads", "uploads"));
    fs.unlink(thumbPath, () => {});
  }

  db.prepare("DELETE FROM blogs WHERE id = ?").run(req.params.id);
  res.json({ message: "Blog post deleted." });
});

// Admin-only listing that includes unpublished drafts
router.get("/admin/all", requireAuth, (req, res) => {
  const rows = db.prepare("SELECT * FROM blogs ORDER BY publish_date DESC").all();
  res.json(rows.map(serialize));
});

module.exports = router;
