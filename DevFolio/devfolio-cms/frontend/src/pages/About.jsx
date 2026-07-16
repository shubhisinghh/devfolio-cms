import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail } from "lucide-react";
import api, { assetUrl } from "../api/client";
import { Loader } from "../components/Loader";

export default function About() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/profile").then((res) => setProfile(res.data));
  }, []);

  if (!profile) return <Loader label="loading about.jsx" />;

  return (
    <section className="section">
      <span className="eyebrow mb-3">about</span>
      <h1 className="h2-display mb-10">Who I am</h1>

      <div className="grid md:grid-cols-[220px_1fr] gap-10 items-start">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
          <div className="surface aspect-square overflow-hidden mb-4">
            {profile.photo ? (
              <img src={assetUrl(profile.photo)} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-mono text-4xl text-cyan bg-ink-surface2">
                {profile.name?.[0] || "D"}
              </div>
            )}
          </div>
          <div className="space-y-2">
            {profile.location && (
              <div className="flex items-center gap-2 text-muted text-sm font-mono">
                <MapPin size={14} /> {profile.location}
              </div>
            )}
            {profile.email && (
              <div className="flex items-center gap-2 text-muted text-sm font-mono">
                <Mail size={14} /> {profile.email}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <h2 className="font-display text-2xl font-semibold text-heading mb-2">{profile.name}</h2>
          <p className="text-cyan font-mono text-sm mb-6">{profile.title}</p>
          <div className="prose-devfolio">
            {profile.about?.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
