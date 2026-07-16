const express = require("express");
const { body, validationResult } = require("express-validator");
const db = require("../db/database");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function serialize(m) {
  return { ...m, is_read: !!m.is_read };
}

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("Enter a valid email address."),
    body("message").notEmpty().withMessage("Message cannot be empty."),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const { name, email, subject, message } = req.body;
    const info = db
      .prepare("INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)")
      .run(name, email, subject || "", message);

    const saved = db.prepare("SELECT * FROM messages WHERE id = ?").get(info.lastInsertRowid);
    res.status(201).json({ message: "Message sent successfully.", data: serialize(saved) });
  }
);

router.get("/", requireAuth, (req, res) => {
  const rows = db.prepare("SELECT * FROM messages ORDER BY created_at DESC").all();
  res.json(rows.map(serialize));
});

router.patch("/:id/read", requireAuth, (req, res) => {
  const existing = db.prepare("SELECT * FROM messages WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Message not found." });

  const newStatus = existing.is_read ? 0 : 1;
  db.prepare("UPDATE messages SET is_read = ? WHERE id = ?").run(newStatus, req.params.id);
  const updated = db.prepare("SELECT * FROM messages WHERE id = ?").get(req.params.id);
  res.json(serialize(updated));
});

router.delete("/:id", requireAuth, (req, res) => {
  const existing = db.prepare("SELECT * FROM messages WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Message not found." });

  db.prepare("DELETE FROM messages WHERE id = ?").run(req.params.id);
  res.json({ message: "Message deleted." });
});

module.exports = router;
