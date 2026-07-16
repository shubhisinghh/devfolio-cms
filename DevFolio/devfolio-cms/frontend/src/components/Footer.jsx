import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useEffect, useState } from "react";
import api from "../api/client";

export default function Footer() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/profile").then((res) => setProfile(res.data)).catch(() => {});
  }, []);

  return (
    <footer className="border-t border-base mt-24">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-mono text-xs text-muted">
          <span className="text-cyan">console</span>.log(
          <span className="text-amber">"thanks for visiting, come back soon"</span>);
        </div>

        <div className="flex items-center gap-3">
          {profile?.github && (
            <a href={profile.github} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg surface-2 flex items-center justify-center text-muted hover:text-cyan transition-colors">
              <FaGithub size={16} />
            </a>
          )}
          {profile?.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg surface-2 flex items-center justify-center text-muted hover:text-cyan transition-colors">
              <FaLinkedin size={16} />
            </a>
          )}
          {profile?.twitter && (
            <a href={profile.twitter} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg surface-2 flex items-center justify-center text-muted hover:text-cyan transition-colors">
              <FaTwitter size={16} />
            </a>
          )}
          {profile?.email && (
            <a href={`mailto:${profile.email}`} className="w-9 h-9 rounded-lg surface-2 flex items-center justify-center text-muted hover:text-cyan transition-colors">
              <Mail size={16} />
            </a>
          )}
        </div>

        <div className="flex items-center gap-4 font-mono text-xs text-muted">
          <span>&copy; {new Date().getFullYear()} {profile?.name || "devfolio"}</span>
          <Link to="/login" className="hover:text-cyan transition-colors">
            admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
