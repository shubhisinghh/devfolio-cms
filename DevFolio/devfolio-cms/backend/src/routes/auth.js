const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("../db/database");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid email address."),
    body("password").isLength({ min: 1 }).withMessage("Password is required."),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, password } = req.body;
    const admin = db.prepare("SELECT * FROM admin WHERE email = ?").get(email);

    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return res.status(401).json({ error: "Incorrect email or password." });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, admin: { id: admin.id, email: admin.email } });
  }
);

router.get("/me", requireAuth, (req, res) => {
  res.json({ admin: req.admin });
});

router.post(
  "/change-password",
  requireAuth,
  [
    body("currentPassword").isLength({ min: 1 }).withMessage("Current password is required."),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters."),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { currentPassword, newPassword } = req.body;
    const admin = db.prepare("SELECT * FROM admin WHERE id = ?").get(req.admin.id);

    if (!bcrypt.compareSync(currentPassword, admin.password)) {
      return res.status(401).json({ error: "Current password is incorrect." });
    }

    const hashed = bcrypt.hashSync(newPassword, 10);
    db.prepare("UPDATE admin SET password = ? WHERE id = ?").run(hashed, admin.id);
    res.json({ message: "Password updated successfully." });
  }
);

module.exports = router;
