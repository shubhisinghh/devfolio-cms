const Database = require("better-sqlite3");
const path = require("path");
const bcrypt = require("bcryptjs");

const DB_PATH = path.join(__dirname, "devfolio.db");
const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

function init() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT,
      technologies TEXT NOT NULL DEFAULT '[]',
      github_link TEXT,
      demo_link TEXT,
      category TEXT NOT NULL DEFAULT 'Web',
      featured INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT,
      thumbnail TEXT,
      tags TEXT NOT NULL DEFAULT '[]',
      published INTEGER NOT NULL DEFAULT 1,
      views INTEGER NOT NULL DEFAULT 0,
      publish_date TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT,
      title TEXT,
      bio TEXT,
      about TEXT,
      photo TEXT,
      email TEXT,
      location TEXT,
      github TEXT,
      linkedin TEXT,
      twitter TEXT,
      website TEXT,
      resume_file TEXT,
      resume_original_name TEXT,
      resume_uploaded_at TEXT,
      skills TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS stats (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      visitor_count INTEGER NOT NULL DEFAULT 0,
      resume_downloads INTEGER NOT NULL DEFAULT 0
    );
  `);

  const adminCount = db.prepare("SELECT COUNT(*) as c FROM admin").get().c;
  if (adminCount === 0) {
    const email = process.env.ADMIN_EMAIL || "admin@devfolio.com";
    const rawPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    const hashed = bcrypt.hashSync(rawPassword, 10);
    db.prepare("INSERT INTO admin (email, password) VALUES (?, ?)").run(email, hashed);
    console.log(`Admin account created -> ${email} / ${rawPassword}`);
  }

  const profileCount = db.prepare("SELECT COUNT(*) as c FROM profile").get().c;
  if (profileCount === 0) {
    db.prepare(`
      INSERT INTO profile (id, name, title, bio, about, email, location, github, linkedin, twitter, website, skills)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      "Shubhi Sharma",
      "Full-Stack Developer & CS Fresher",
      "I build clean, fast, and reliable web applications from the database to the browser.",
      "I'm a fresher software developer who enjoys turning ideas into working products. I care about readable code, thoughtful UI, and solving real problems rather than just shipping features. Outside of coding, I spend time on competitive programming, sharpening algorithmic thinking one problem at a time.",
      "hello@devfolio.com",
      "India",
      "https://github.com/",
      "https://linkedin.com/",
      "https://twitter.com/",
      "",
      JSON.stringify(["JavaScript", "React", "Node.js", "Express", "SQL", "Java", "Python", "Tailwind CSS", "Git"])
    );
  }

  const statsCount = db.prepare("SELECT COUNT(*) as c FROM stats").get().c;
  if (statsCount === 0) {
    db.prepare("INSERT INTO stats (id, visitor_count, resume_downloads) VALUES (1, 0, 0)").run();
  }
}

init();

module.exports = db;
