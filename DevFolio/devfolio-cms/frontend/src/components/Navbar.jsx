import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { Moon, Sun, Menu, X, Terminal } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const links = [
  { to: "/", label: "home.jsx" },
  { to: "/about", label: "about.jsx" },
  { to: "/skills", label: "skills.jsx" },
  { to: "/projects", label: "projects.jsx" },
  { to: "/blog", label: "blog.jsx" },
  { to: "/resume", label: "resume.pdf" },
  { to: "/contact", label: "contact.jsx" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "backdrop-blur-md bg-ink-bg/85 border-ink-border"
          : "bg-transparent border-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold text-lg text-current" onClick={() => setOpen(false)}>
          <Terminal size={20} className="text-cyan" />
          <span>dev</span>
          <span className="text-cyan">folio</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1 surface-2 px-1.5 py-1.5 rounded-lg">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `font-mono text-xs px-3 py-1.5 rounded-md transition-colors ${
                  isActive
                    ? "bg-ink-bg text-cyan border border-ink-border"
                    : "text-slate-400 hover:text-slate-200"
                }`
              }
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="w-9 h-9 rounded-lg surface-2 flex items-center justify-center text-slate-300 hover:text-cyan transition-colors"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="lg:hidden w-9 h-9 rounded-lg surface-2 flex items-center justify-center text-slate-300"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden px-6 pb-4 flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `font-mono text-sm px-3 py-2.5 rounded-md transition-colors ${
                  isActive ? "bg-ink-surface2 text-cyan" : "text-slate-400"
                }`
              }
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
