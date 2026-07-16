import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Star, FolderKanban } from "lucide-react";
import toast from "react-hot-toast";
import api, { assetUrl } from "../../api/client";
import { Loader, EmptyState } from "../../components/Loader";
import Modal from "../../components/admin/Modal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

const emptyForm = {
  title: "",
  description: "",
  technologies: "",
  github_link: "",
  demo_link: "",
  category: "Web",
  featured: false,
};

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get("/projects")
      .then((res) => setProjects(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setForm({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(", "),
      github_link: project.github_link || "",
      demo_link: project.demo_link || "",
      category: project.category,
      featured: project.featured,
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append(
        "technologies",
        JSON.stringify(
          form.technologies
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        )
      );
      fd.append("github_link", form.github_link);
      fd.append("demo_link", form.demo_link);
      fd.append("category", form.category);
      fd.append("featured", form.featured);
      if (imageFile) fd.append("image", imageFile);

      if (editing) {
        await api.put(`/projects/${editing.id}`, fd);
        toast.success("Project updated");
      } else {
        await api.post("/projects", fd);
        toast.success("Project created");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/projects/${deleteTarget.id}`);
      toast.success("Project deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="eyebrow mb-2">manage</span>
          <h1 className="h2-display">Projects</h1>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={15} /> New project
        </button>
      </div>

      {loading ? (
        <Loader label="loading projects" />
      ) : projects.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects yet" description="Add your first project to get started." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <div key={p.id} className="surface overflow-hidden flex flex-col">
              <div className="aspect-video bg-ink-surface2 border-b border-base overflow-hidden">
                {p.image ? (
                  <img src={assetUrl(p.image)} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-xs text-muted">no image</div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[11px] text-cyan">{p.category}</span>
                  {p.featured && <Star size={13} className="text-amber fill-amber" />}
                </div>
                <h3 className="font-display font-semibold text-heading mb-2">{p.title}</h3>
                <p className="text-body text-sm mb-4 flex-1 line-clamp-2">{p.description}</p>
                <div className="flex gap-2 pt-3 border-t border-base">
                  <button onClick={() => openEdit(p)} className="btn-outline flex-1 !text-xs !py-2">
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => setDeleteTarget(p)} className="btn-danger !text-xs !py-2 !px-3">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit project" : "New project"} wide>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-xs text-muted mb-1.5 block">Title</label>
            <input required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="font-mono text-xs text-muted mb-1.5 block">Description</label>
            <textarea
              required
              rows={3}
              className="input resize-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-muted mb-1.5 block">Category</label>
              <input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Web, Data Analytics..." />
            </div>
            <div>
              <label className="font-mono text-xs text-muted mb-1.5 block">Technologies (comma separated)</label>
              <input className="input" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="React, Node.js" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-muted mb-1.5 block">GitHub link</label>
              <input className="input" value={form.github_link} onChange={(e) => setForm({ ...form, github_link: e.target.value })} placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="font-mono text-xs text-muted mb-1.5 block">Demo link</label>
              <input className="input" value={form.demo_link} onChange={(e) => setForm({ ...form, demo_link: e.target.value })} placeholder="https://..." />
            </div>
          </div>
          <div>
            <label className="font-mono text-xs text-muted mb-1.5 block">Project image</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="input !py-2" />
          </div>
          <label className="flex items-center gap-2 font-mono text-xs text-body">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-cyan w-4 h-4" />
            Show on homepage (featured)
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving..." : editing ? "Save changes" : "Create project"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete project?"
        description={`"${deleteTarget?.title}" will be permanently removed. This can't be undone.`}
      />
    </div>
  );
}
