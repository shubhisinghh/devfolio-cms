import { useEffect, useState, useMemo } from "react";
import { Search, Newspaper } from "lucide-react";
import api from "../api/client";
import BlogCard from "../components/BlogCard";
import { Loader, EmptyState } from "../components/Loader";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/blogs")
      .then((res) => setBlogs(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search) return blogs;
    const q = search.toLowerCase();
    return blogs.filter((b) => b.title.toLowerCase().includes(q) || (b.excerpt || "").toLowerCase().includes(q));
  }, [blogs, search]);

  return (
    <section className="section">
      <span className="eyebrow mb-3">blog</span>
      <h1 className="h2-display mb-3">Notes & write-ups</h1>
      <p className="text-body max-w-xl mb-8">
        Thoughts on building this project, and notes from working through algorithm problems.
      </p>

      <div className="relative max-w-md mb-8">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          className="input pl-10"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <Loader label="fetching posts" />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Newspaper} title="No posts found" description="Check back soon for new writing." />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((b, i) => (
            <BlogCard key={b.id} blog={b} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
