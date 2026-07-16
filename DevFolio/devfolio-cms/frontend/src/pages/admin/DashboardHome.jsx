import { useEffect, useState } from "react";
import { FolderKanban, Newspaper, Mail, Download, Users, MailWarning } from "lucide-react";
import api from "../../api/client";
import StatCard from "../../components/admin/StatCard";
import { Loader } from "../../components/Loader";

export default function DashboardHome() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/stats/dashboard").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <Loader label="loading dashboard" />;

  return (
    <div>
      <div className="mb-8">
        <span className="eyebrow mb-2">overview</span>
        <h1 className="h2-display">Dashboard</h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total projects" value={stats.totalProjects} icon={FolderKanban} accent="cyan" />
        <StatCard label="Total blog posts" value={stats.totalBlogs} icon={Newspaper} accent="violet" />
        <StatCard label="Messages" value={stats.totalMessages} icon={Mail} accent="amber" />
        <StatCard label="Unread messages" value={stats.unreadMessages} icon={MailWarning} accent="rose" />
        <StatCard label="Visitors" value={stats.visitorCount} icon={Users} accent="cyan" />
        <StatCard label="Resume downloads" value={stats.resumeDownloads} icon={Download} accent="violet" />
      </div>

      <div className="surface p-6">
        <span className="font-mono text-xs text-muted mb-3 block">// quick tips</span>
        <ul className="space-y-2 text-sm text-body">
          <li>• Add your featured projects first — they show up on the homepage.</li>
          <li>• Upload a resume PDF from the Resume tab so visitors can view and download it.</li>
          <li>• Mark messages as read once you've responded, to keep the inbox tidy.</li>
        </ul>
      </div>
    </div>
  );
}
