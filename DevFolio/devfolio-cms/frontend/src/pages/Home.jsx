import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import EditorWindow from "../components/EditorWindow";
import ProjectCard from "../components/ProjectCard";
import BlogCard from "../components/BlogCard";
import { Loader } from "../components/Loader";
import api, { assetUrl } from "../api/client";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.post("/stats/visit").catch(() => {});
    Promise.all([
      api.get("/profile"),
      api.get("/projects"),
      api.get("/blogs"),
    ])
      .then(([p, proj, b]) => {
        setProfile(p.data);
        setProjects(proj.data.filter((x) => x.featured).slice(0, 3));
        setBlogs(b.data.slice(0, 2));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="compiling portfolio" />;

  return (
    <div>
      {/* Hero */}
      <section className="section pt-16 md:pt-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="eyebrow mb-4">available for opportunities</span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-heading leading-tight tracking-tight mb-5">
            {profile?.name || "Hi, I'm a developer."}
          </h1>
          <p className="text-body text-lg leading-relaxed mb-8 max-w-lg">
            {profile?.bio}
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Link to="/projects" className="btn-primary">
              View projects <ArrowRight size={15} />
            </Link>
            <Link to="/contact" className="btn-outline">
              Get in touch
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {profile?.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg surface-2 flex items-center justify-center text-muted hover:text-cyan transition-colors">
                <FaGithub size={17} />
              </a>
            )}
            {profile?.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg surface-2 flex items-center justify-center text-muted hover:text-cyan transition-colors">
                <FaLinkedin size={17} />
              </a>
            )}
            {profile?.twitter && (
              <a href={profile.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg surface-2 flex items-center justify-center text-muted hover:text-cyan transition-colors">
                <FaTwitter size={17} />
              </a>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
          <EditorWindow />
        </motion.div>
      </section>

      {/* Featured projects */}
      {projects.length > 0 && (
        <section className="section pt-0">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="eyebrow mb-2">featured work</span>
              <h2 className="h2-display">Selected projects</h2>
            </div>
            <Link to="/projects" className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-cyan hover:gap-2.5 transition-all">
              all projects <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Latest blog */}
      {blogs.length > 0 && (
        <section className="section pt-0">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="eyebrow mb-2">from the blog</span>
              <h2 className="h2-display">Recent writing</h2>
            </div>
            <Link to="/blog" className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-cyan hover:gap-2.5 transition-all">
              all posts <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {blogs.map((b, i) => (
              <BlogCard key={b.id} blog={b} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Resume CTA */}
      <section className="section pt-0">
        <div className="surface p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="eyebrow mb-2">resume.pdf</span>
            <h3 className="h2-display text-2xl md:text-3xl">Want the full story on paper?</h3>
          </div>
          <Link to="/resume" className="btn-primary flex-shrink-0">
            <Download size={15} /> View resume
          </Link>
        </div>
      </section>
    </div>
  );
}
