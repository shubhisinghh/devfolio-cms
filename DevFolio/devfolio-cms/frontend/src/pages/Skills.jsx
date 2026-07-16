import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/client";
import { Loader } from "../components/Loader";

export default function Skills() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/profile").then((res) => setProfile(res.data));
  }, []);

  if (!profile) return <Loader label="loading skills.jsx" />;

  return (
    <section className="section">
      <span className="eyebrow mb-3">skills</span>
      <h1 className="h2-display mb-3">What I work with</h1>
      <p className="text-body max-w-xl mb-10">
        The languages, frameworks, and tools I reach for most often when building something.
      </p>

      <div className="flex flex-wrap gap-3">
        {profile.skills.map((skill, i) => (
          <motion.div
            key={skill}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="surface-2 px-4 py-3 flex items-center gap-2 hover:border-cyan/50 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
            <span className="font-mono text-sm text-heading">{skill}</span>
          </motion.div>
        ))}
      </div>

      {profile.skills.length === 0 && (
        <p className="text-muted font-mono text-sm">No skills added yet.</p>
      )}
    </section>
  );
}
