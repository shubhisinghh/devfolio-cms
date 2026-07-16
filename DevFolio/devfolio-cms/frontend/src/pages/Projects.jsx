import { useEffect, useState, useMemo } from "react";
import { Search, FolderOpen } from "lucide-react";
import api from "../api/client";
import ProjectCard from "../components/ProjectCard";
import { Loader, EmptyState } from "../components/Loader";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    api
      .get("/projects")
      .then((res) => setProjects(res.data))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [projects, search, category]);

  return (
    <section className="section">
      <span className="eyebrow mb-3">projects</span>
      <h1 className="h2-display mb-3">Things I've built</h1>
      <p className="text-body max-w-xl mb-8">
        A mix of full-stack apps, data projects, and algorithm practice — pulled live from the database.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className="input pl-10"
            placeholder="Search projects, tech..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`font-mono text-xs px-3.5 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
                category === c ? "bg-cyan text-ink-bg" : "surface-2 text-muted hover:text-heading"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader label="fetching projects" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No projects found"
          description="Try a different search term or category."
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
