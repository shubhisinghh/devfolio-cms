# devfolio — Developer Portfolio CMS

A full-stack developer portfolio with a secure admin dashboard. Manage your
projects, blog posts, resume, profile, and contact messages without ever
touching code — everything is stored in a real database and served through
a REST API.

Built exactly to the brief: React frontend, Node.js + Express backend,
JavaScript throughout. Instead of requiring you to spin up a Supabase
project before it even runs, the backend uses an embedded SQLite database
(`better-sqlite3`) — zero external services, zero config, works immediately
after `npm install`. Swapping in Postgres/Supabase later only means changing
the `db/database.js` file; every route already talks to it through the same
interface.

## What's included

- **Public site** — Home, About, Skills, Projects (search + filter), Blog
  (Markdown posts, reading time, view counts), Resume (inline PDF viewer +
  download), Contact form.
- **Admin dashboard** — email/password login (JWT), stat cards, full CRUD
  for projects and blog posts (with image/thumbnail uploads and a Markdown
  editor with live preview), inbox for contact messages (read/unread,
  delete), resume upload, and a profile/settings editor.
- **Polish** — dark/light mode, scroll progress bar, custom 404 page,
  responsive layout, loading and empty states, toast notifications.

## Project structure

```
devfolio-cms/
├── backend/           Express API + SQLite database + file uploads
│   ├── src/
│   │   ├── db/         database.js (schema + init), seed.js (sample data)
│   │   ├── middleware/  auth.js (JWT), upload.js (multer)
│   │   ├── routes/      auth, projects, blogs, messages, profile, resume, stats
│   │   └── server.js
│   └── .env            environment variables (already filled in with defaults)
└── frontend/           React (Vite) + Tailwind CSS + Framer Motion
    └── src/
        ├── api/         axios client
        ├── context/      auth + theme state
        ├── components/   shared UI + admin/ subfolder
        └── pages/        public pages + admin/ subfolder
```

## Running it locally

You need Node.js 18+ installed. Two terminals, one for each half:

**1. Backend**

```bash
cd backend
npm install
npm run seed     # creates the database file with sample projects/blog posts
npm start        # runs on http://localhost:5000
```

**2. Frontend**

```bash
cd frontend
npm install
npm run dev       # runs on http://localhost:5173
```

Open `http://localhost:5173` in your browser. The frontend is already
configured (via `frontend/.env`) to talk to the backend at
`http://localhost:5000`.

## Admin login

```
URL:      http://localhost:5173/login
Email:    admin@devfolio.com
Password: Admin@123
```

Change this password immediately from **Admin → Settings → Change
password** once you're in, and update `backend/.env` if you reseed later.

## Editing your content

Everything shown on the public site is pulled from the database — there's
nothing to hardcode:

- **Projects / Blog posts** — Admin → Projects / Blogs → add, edit, delete.
  Blog posts use Markdown (with a live preview toggle).
- **Resume** — Admin → Resume → upload a PDF. It immediately becomes the
  file served on the public `/resume` page.
- **Profile** — Admin → Settings → name, title, bio, about text, social
  links, skills, and photo. This feeds the Home, About, Skills and Contact
  pages.

## Notes on the tech choices

- **Database**: SQLite via `better-sqlite3` instead of Supabase/Postgres —
  it needs no separate service, no connection string, and no account setup,
  so the project runs immediately on any machine. It's a real relational
  database with the same tables the brief describes (Projects, Blogs,
  Messages, Profile); moving to Postgres later is a matter of swapping the
  driver in `backend/src/db/database.js`, not rewriting the app.
- **Auth**: bcrypt-hashed password + JWT, checked by an Express middleware
  on every admin-only route (not just hidden in the frontend).
- **File uploads**: handled by `multer`, saved under `backend/src/uploads/`
  and served statically — project images, blog thumbnails, profile photos,
  and resume PDFs.
- **Deployment**: the frontend build (`npm run build` inside `frontend/`)
  produces a static `dist/` folder deployable to Vercel/Netlify. The backend
  is a standard Node/Express app deployable to Render/Railway/Fly — just
  point `VITE_API_URL` in the frontend at your deployed backend URL.

## Troubleshooting

- **"Cannot connect to backend" in the browser** — make sure the backend is
  running on port 5000 (`npm start` inside `backend/`) before loading the
  frontend.
- **Port already in use** — change `PORT` in `backend/.env`, or the `--port`
  flag for the frontend, and update `frontend/.env`'s `VITE_API_URL` to
  match.
- **Reset all data** — stop the backend, delete
  `backend/src/db/devfolio.db*`, then run `npm run seed` again.
