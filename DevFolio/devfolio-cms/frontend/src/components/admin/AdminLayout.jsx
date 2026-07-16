import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex bg-base">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 min-w-0">
        <div className="h-16 border-b border-base flex items-center justify-between px-5 lg:px-8 sticky top-0 bg-base-90 backdrop-blur z-20">
          <button
            className="lg:hidden w-9 h-9 rounded-lg surface-2 flex items-center justify-center text-muted"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={16} />
          </button>
          <span className="hidden lg:block font-mono text-xs text-muted">// admin dashboard</span>
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg surface-2 flex items-center justify-center text-muted hover:text-cyan transition-colors"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
        <div className="p-5 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
