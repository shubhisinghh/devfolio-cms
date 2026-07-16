import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Newspaper, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api, { assetUrl } from "../../api/client";
import { Loader, EmptyState } from "../../components/Loader";
import Modal from "../../components/admin/Modal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

const emptyForm = { title: "", content: "", excerpt: "", tags: "", published: true };

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [thumbFile, setThumbFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get("/blogs/admin/all")
      .then((res) => setBlogs(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setThumbFile(null);
    setPreview(false);
    setModalOpen(true);
  };

  const openEdit = (blog) => {
    setEditing(blog);
    setForm({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || "",
      tags: blog.tags.join(", "),
      published: blog.published,
    });
    setThumbFile(null);
    setPreview(false);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("content", form.content);
      fd.append("excerpt", form.excerpt);
      fd.append(
        "tags",
        JSON.stringify(
          form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        )
      );
      fd.append("published", form.published);
      if (thumbFile) fd.append("thumbnail", thumbFile);

      if (editing) {
        await api.put(`/blogs/${editing.id}`, fd);
        toast.success("Post updated");
      } else {
        await api.post("/blogs", fd);
        toast.success("Post published");
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
      await api.delete(`/blogs/${deleteTarget.id}`);
      toast.success("Post deleted");
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
          <h1 className="h2-display">Blog</h1>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={15} /> New post
        </button>
      </div>

      {loading ? (
        <Loader label="loading posts" />
      ) : blogs.length === 0 ? (
        <EmptyState icon={Newspaper} title="No posts yet" description="Write your first post to get started." />
      ) : (
        <div className="surface divide-y divide-ink-border">
          {blogs.map((b) => (
            <div key={b.id} className="p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-ink-surface2 border border-base flex-shrink-0">
                {b.thumbnail ? (
                  <img src={assetUrl(b.thumbnail)} alt={b.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted">
                    <Newspaper size={16} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-heading truncate">{b.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${b.published ? "bg-cyan/10 text-cyan" : "bg-amber/10 text-amber"}`}>
                    {b.published ? "published" : "draft"}
                  </span>
                  <span className="font-mono text-[11px] text-muted">{b.reading_time} min · {b.views} views</span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(b)} className="btn-outline !text-xs !py-2 !px-3">
                  <Pencil size={13} />
                </button>
                <button onClick={() => setDeleteTarget(b)} className="btn-danger !text-xs !py-2 !px-3">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit post" : "New post"} wide>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-xs text-muted mb-1.5 block">Title</label>
            <input required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="font-mono text-xs text-muted mb-1.5 block">Excerpt (short summary)</label>
            <input className="input" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Shown on the blog list card" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-mono text-xs text-muted">Content (Markdown)</label>
              <button
                type="button"
                onClick={() => setPreview((p) => !p)}
                className="font-mono text-[11px] text-cyan flex items-center gap-1"
              >
                {preview ? <EyeOff size={12} /> : <Eye size={12} />} {preview ? "Edit" : "Preview"}
              </button>
            </div>
            {preview ? (
              <div className="surface-2 p-4 max-h-80 overflow-y-auto prose-devfolio">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content || "*Nothing to preview yet*"}</ReactMarkdown>
              </div>
            ) : (
              <textarea
                required
                rows={10}
                className="input resize-none font-mono text-sm"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="# Heading&#10;&#10;Write your post in Markdown..."
              />
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-muted mb-1.5 block">Tags (comma separated)</label>
              <input className="input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Career, Web Development" />
            </div>
            <div>
              <label className="font-mono text-xs text-muted mb-1.5 block">Thumbnail</label>
              <input type="file" accept="image/*" onChange={(e) => setThumbFile(e.target.files[0])} className="input !py-2" />
            </div>
          </div>
          <label className="flex items-center gap-2 font-mono text-xs text-body">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="accent-cyan w-4 h-4" />
            Published (visible to visitors)
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving..." : editing ? "Save changes" : "Publish post"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete post?"
        description={`"${deleteTarget?.title}" will be permanently removed. This can't be undone.`}
      />
    </div>
  );
}
