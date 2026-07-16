import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderKanban, Newspaper, Mail, FileText, Settings, LogOut, Terminal, ExternalLink } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/blogs", label: "Blogs", icon: Newspaper },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/resume", label: "Resume", icon: FileText },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({ mobileOpen, onClose }) {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 surface !rounded-none border-r border-base flex flex-col z-40 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-16 flex items-center gap-2 px-5 border-b border-base">
          <Terminal size={20} className="text-cyan" />
          <span className="font-display font-semibold text-heading">devfolio</span>
          <span className="tag ml-auto">admin</span>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-sm transition-colors ${
                  isActive ? "bg-ink-surface2 text-cyan" : "text-muted hover:text-heading"
                }`
              }
            >
              <l.icon size={16} />
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-base flex flex-col gap-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-sm text-muted hover:text-heading transition-colors"
          >
            <ExternalLink size={16} />
            View site
          </a>
          <div className="px-3 py-2 font-mono text-[11px] text-muted truncate">{admin?.email}</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-sm text-rose hover:bg-rose/10 transition-colors"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
