import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Eye } from "lucide-react";
import { assetUrl } from "../api/client";

export default function BlogCard({ blog, index = 0 }) {
  const date = new Date(blog.publish_date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
    >
      <Link
        to={`/blog/${blog.slug}`}
        className="surface overflow-hidden flex flex-col h-full group hover:border-cyan/50 transition-colors"
      >
        <div className="aspect-[16/9] bg-ink-surface2 overflow-hidden border-b border-base">
          {blog.thumbnail ? (
            <img
              src={assetUrl(blog.thumbnail)}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-mono text-xs text-muted">
              /* no thumbnail */
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {blog.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="font-display font-semibold text-lg text-heading mb-2 group-hover:text-cyan transition-colors">
            {blog.title}
          </h3>
          <p className="text-body text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{blog.excerpt}</p>
          <div className="flex items-center justify-between pt-3 border-t border-base font-mono text-[11px] text-muted">
            <span>{date}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock size={12} /> {blog.reading_time} min
              </span>
              <span className="flex items-center gap-1">
                <Eye size={12} /> {blog.views}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
