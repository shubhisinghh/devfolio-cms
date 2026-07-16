import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { assetUrl } from "../api/client";

export default function ProjectCard({ project, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
      className="surface overflow-hidden group flex flex-col h-full hover:border-cyan/50 transition-colors"
    >
      <div className="aspect-video bg-ink-surface2 overflow-hidden relative border-b border-base">
        {project.image ? (
          <img
            src={assetUrl(project.image)}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-mono text-xs text-muted">
            &lt;no-preview.png /&gt;
          </div>
        )}
        {project.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-ink-bg/80 backdrop-blur px-2 py-1 rounded-md border border-base">
            <Star size={11} className="text-amber fill-amber" />
            <span className="font-mono text-[10px] text-amber">featured</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <span className="font-mono text-[11px] text-cyan mb-1">{project.category}</span>
        <h3 className="font-display font-semibold text-lg text-heading mb-2">{project.title}</h3>
        <p className="text-body text-sm leading-relaxed mb-4 flex-1">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.map((tech) => (
            <span key={tech} className="tag">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-base">
          {project.github_link && (
            <a
              href={project.github_link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs text-muted hover:text-cyan transition-colors"
            >
              <FaGithub size={14} /> code
            </a>
          )}
          {project.demo_link && (
            <a
              href={project.demo_link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs text-muted hover:text-cyan transition-colors"
            >
              <ExternalLink size={14} /> live demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
