import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/client";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/profile").then((res) => setProfile(res.data));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/messages", form);
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast.success("Message sent!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section">
      <span className="eyebrow mb-3">contact</span>
      <h1 className="h2-display mb-3">Let's talk</h1>
      <p className="text-body max-w-xl mb-10">
        Have a role, a project, or just want to say hi? Send a message and I'll get back to you.
      </p>

      <div className="grid md:grid-cols-[1fr_1.4fr] gap-8">
        <div className="space-y-4">
          {profile?.email && (
            <div className="surface-2 p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg surface flex items-center justify-center text-cyan flex-shrink-0">
                <Mail size={15} />
              </div>
              <div>
                <div className="font-mono text-[11px] text-muted">email</div>
                <div className="text-sm text-heading">{profile.email}</div>
              </div>
            </div>
          )}
          {profile?.location && (
            <div className="surface-2 p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg surface flex items-center justify-center text-cyan flex-shrink-0">
                <MapPin size={15} />
              </div>
              <div>
                <div className="font-mono text-[11px] text-muted">location</div>
                <div className="text-sm text-heading">{profile.location}</div>
              </div>
            </div>
          )}
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="surface p-6 md:p-8">
          {sent ? (
            <div className="flex flex-col items-center text-center py-10">
              <CheckCircle2 size={36} className="text-cyan mb-4" />
              <h3 className="font-display font-semibold text-heading text-lg mb-1">Message sent</h3>
              <p className="text-muted text-sm mb-6">Thanks for reaching out — I'll reply soon.</p>
              <button className="btn-outline" onClick={() => setSent(false)}>
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs text-muted mb-1.5 block">Name</label>
                  <input required name="name" value={form.name} onChange={handleChange} className="input" placeholder="Your name" />
                </div>
                <div>
                  <label className="font-mono text-xs text-muted mb-1.5 block">Email</label>
                  <input required type="email" name="email" value={form.email} onChange={handleChange} className="input" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="font-mono text-xs text-muted mb-1.5 block">Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange} className="input" placeholder="What's this about?" />
              </div>
              <div>
                <label className="font-mono text-xs text-muted mb-1.5 block">Message</label>
                <textarea
                  required
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  className="input resize-none"
                  placeholder="Tell me a bit more..."
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
                <Send size={15} /> {submitting ? "Sending..." : "Send message"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
