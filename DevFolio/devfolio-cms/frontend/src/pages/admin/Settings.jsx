import { useEffect, useState } from "react";
import { Save, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import api, { assetUrl } from "../../api/client";
import { Loader } from "../../components/Loader";

export default function Settings() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    api.get("/profile").then((res) => {
      setProfile(res.data);
      setForm({
        name: res.data.name || "",
        title: res.data.title || "",
        bio: res.data.bio || "",
        about: res.data.about || "",
        email: res.data.email || "",
        location: res.data.location || "",
        github: res.data.github || "",
        linkedin: res.data.linkedin || "",
        twitter: res.data.twitter || "",
        website: res.data.website || "",
        skills: res.data.skills.join(", "),
      });
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "skills") {
          fd.append("skills", JSON.stringify(v.split(",").map((s) => s.trim()).filter(Boolean)));
        } else {
          fd.append(k, v);
        }
      });
      if (photoFile) fd.append("photo", photoFile);
      const res = await api.put("/profile", fd);
      setProfile(res.data);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwSaving(true);
    try {
      await api.post("/auth/change-password", pwForm);
      toast.success("Password updated");
      setPwForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not update password");
    } finally {
      setPwSaving(false);
    }
  };

  if (!form) return <Loader label="loading settings" />;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <span className="eyebrow mb-2">manage</span>
        <h1 className="h2-display">Settings</h1>
      </div>

      <form onSubmit={handleSave} className="surface p-6 space-y-5">
        <h2 className="font-display font-semibold text-heading mb-1">Profile</h2>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden surface-2 flex-shrink-0">
            {profile?.photo ? (
              <img src={assetUrl(profile.photo)} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-mono text-lg text-cyan">
                {form.name?.[0] || "D"}
              </div>
            )}
          </div>
          <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} className="font-mono text-xs text-body" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs text-muted mb-1.5 block">Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="font-mono text-xs text-muted mb-1.5 block">Title</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="font-mono text-xs text-muted mb-1.5 block">Short bio (used on homepage)</label>
          <textarea rows={2} className="input resize-none" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>

        <div>
          <label className="font-mono text-xs text-muted mb-1.5 block">About (used on About page, separate paragraphs with blank line)</label>
          <textarea rows={5} className="input resize-none" value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs text-muted mb-1.5 block">Email</label>
            <input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="font-mono text-xs text-muted mb-1.5 block">Location</label>
            <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs text-muted mb-1.5 block">GitHub URL</label>
            <input className="input" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
          </div>
          <div>
            <label className="font-mono text-xs text-muted mb-1.5 block">LinkedIn URL</label>
            <input className="input" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs text-muted mb-1.5 block">Twitter / X URL</label>
            <input className="input" value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} />
          </div>
          <div>
            <label className="font-mono text-xs text-muted mb-1.5 block">Website</label>
            <input className="input" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="font-mono text-xs text-muted mb-1.5 block">Skills (comma separated)</label>
          <textarea rows={2} className="input resize-none" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          <Save size={15} /> {saving ? "Saving..." : "Save profile"}
        </button>
      </form>

      <form onSubmit={handlePasswordChange} className="surface p-6 space-y-4">
        <h2 className="font-display font-semibold text-heading mb-1">Change password</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs text-muted mb-1.5 block">Current password</label>
            <input
              type="password"
              required
              className="input"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
            />
          </div>
          <div>
            <label className="font-mono text-xs text-muted mb-1.5 block">New password</label>
            <input
              type="password"
              required
              minLength={6}
              className="input"
              value={pwForm.newPassword}
              onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
            />
          </div>
        </div>
        <button type="submit" disabled={pwSaving} className="btn-outline">
          <KeyRound size={15} /> {pwSaving ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}
