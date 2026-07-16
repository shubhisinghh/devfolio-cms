const db = require("./database");

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const projectCount = db.prepare("SELECT COUNT(*) as c FROM projects").get().c;

if (projectCount === 0) {
  const projects = [
    {
      title: "RetailEdge Analytics Dashboard",
      description:
        "An end-to-end data analytics dashboard that ingests retail sales data, runs SQL-driven aggregations, and visualizes KPIs like revenue trends, top categories, and customer segments in an interactive dashboard.",
      technologies: JSON.stringify(["Python", "SQL", "Pandas", "Jupyter", "Plotly"]),
      github_link: "https://github.com/",
      demo_link: "",
      category: "Data Analytics",
      featured: 1,
    },
    {
      title: "Developer Portfolio CMS",
      description:
        "This very project — a full-stack portfolio with a secure admin dashboard to manage projects, blog posts, resume uploads, and visitor messages without touching code.",
      technologies: JSON.stringify(["React", "Node.js", "Express", "SQLite", "Tailwind CSS"]),
      github_link: "https://github.com/",
      demo_link: "",
      category: "Full-Stack",
      featured: 1,
    },
    {
      title: "Competitive Programming Vault",
      description:
        "A curated collection of solved algorithmic problems in Java, covering dynamic programming (bounded knapsack variants), greedy strategies, and array manipulation problems with complexity notes.",
      technologies: JSON.stringify(["Java", "Data Structures", "Algorithms"]),
      github_link: "https://github.com/",
      demo_link: "",
      category: "Algorithms",
      featured: 0,
    },
    {
      title: "Task Flow — Kanban Board",
      description:
        "A drag-and-drop task management board with boards, lists, and cards, real-time state updates, and local persistence — built to practice complex UI state management.",
      technologies: JSON.stringify(["React", "Tailwind CSS", "Framer Motion"]),
      github_link: "https://github.com/",
      demo_link: "",
      category: "Frontend",
      featured: 0,
    },
  ];

  const insert = db.prepare(`
    INSERT INTO projects (title, description, image, technologies, github_link, demo_link, category, featured)
    VALUES (@title, @description, @image, @technologies, @github_link, @demo_link, @category, @featured)
  `);

  for (const p of projects) {
    insert.run({ ...p, image: null });
  }
  console.log("Seeded projects");
}

const blogCount = db.prepare("SELECT COUNT(*) as c FROM blogs").get().c;

if (blogCount === 0) {
  const blogs = [
    {
      title: "Why I Built a CMS for My Own Portfolio",
      content: `# Why I Built a CMS for My Own Portfolio

Most fresher portfolios are static: a hardcoded array of projects sitting in a JS file. Every update means opening the code, editing, committing, and redeploying. I wanted something closer to how real products work.

## The problem

Editing content shouldn't require a deployment. A blog post, a new project, a fresh resume — these are content changes, not code changes.

## The approach

I split the app into two clear layers:

- **Public site** — reads data from an API, renders it, and stays completely read-only for visitors.
- **Admin dashboard** — a authenticated area where I can add projects, publish posts, and manage messages through simple forms.

## What I learned

Building the auth layer taught me more about security than any tutorial: hashing passwords, signing JWTs, and protecting routes with middleware instead of trusting the frontend.

This project became less about the portfolio itself and more about practicing the exact workflow a small real-world product would use.`,
      excerpt: "Most fresher portfolios are static. Here's why I turned mine into a full content management system instead.",
      tags: JSON.stringify(["Career", "Web Development"]),
      published: 1,
    },
    {
      title: "Notes on Solving Bounded Knapsack in Java",
      content: `# Notes on Solving Bounded Knapsack in Java

The bounded knapsack problem — where each item has a limited count instead of being unlimited (unbounded) or single-use (0/1) — trips up a lot of people the first time.

## The core idea

Bounded knapsack sits between 0/1 knapsack and unbounded knapsack. The trick is to treat each item's limited copies as a small inner loop, or to use binary/decimal splitting for efficiency when counts get large.

## A simple DP formulation

For each item with count k, weight w, and value v, iterate the achievable counts and update the DP table from high capacity to low, similar to 0/1 knapsack, but repeated up to k times per item.

## Complexity

A naive approach is O(n * capacity * maxCount). Binary splitting each item into powers of two reduces this to roughly O(n * capacity * log(maxCount)), which matters a lot once inputs get large in competitive programming.

Writing this down forced me to actually explain the transition step instead of just pattern-matching to a template — which is usually where I catch my own mistakes.`,
      excerpt: "A breakdown of how bounded knapsack differs from 0/1 and unbounded knapsack, and how to speed it up.",
      tags: JSON.stringify(["Competitive Programming", "Java", "DSA"]),
      published: 1,
    },
  ];

  const insert = db.prepare(`
    INSERT INTO blogs (title, slug, content, excerpt, thumbnail, tags, published)
    VALUES (@title, @slug, @content, @excerpt, @thumbnail, @tags, @published)
  `);

  for (const b of blogs) {
    insert.run({ ...b, slug: slugify(b.title), thumbnail: null });
  }
  console.log("Seeded blogs");
}

console.log("Seed complete.");
