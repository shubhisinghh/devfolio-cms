import { useEffect, useState } from "react";
import { Mail, MailOpen, Trash2, MailX } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/client";
import { Loader, EmptyState } from "../../components/Loader";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .get("/messages")
      .then((res) => setMessages(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleRead = async (msg) => {
    try {
      const res = await api.patch(`/messages/${msg.id}/read`);
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? res.data : m)));
    } catch {
      toast.error("Could not update message");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/messages/${deleteTarget.id}`);
      toast.success("Message deleted");
      setDeleteTarget(null);
      load();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <span className="eyebrow mb-2">manage</span>
        <h1 className="h2-display">Messages</h1>
      </div>

      {loading ? (
        <Loader label="loading messages" />
      ) : messages.length === 0 ? (
        <EmptyState icon={MailX} title="No messages yet" description="Messages from your contact form will show up here." />
      ) : (
        <div className="surface divide-y divide-ink-border">
          {messages.map((m) => (
            <div key={m.id} className="p-4">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleRead(m)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    m.is_read ? "surface-2 text-muted" : "bg-cyan/10 text-cyan"
                  }`}
                  title={m.is_read ? "Mark as unread" : "Mark as read"}
                >
                  {m.is_read ? <MailOpen size={15} /> : <Mail size={15} />}
                </button>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`font-display font-semibold truncate ${m.is_read ? "text-muted" : "text-heading"}`}>
                      {m.subject || "(no subject)"}
                    </h3>
                    <span className="font-mono text-[11px] text-muted flex-shrink-0">
                      {new Date(m.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-cyan mt-0.5">
                    {m.name} &lt;{m.email}&gt;
                  </p>
                  <p className={`text-sm text-body mt-2 ${expanded === m.id ? "" : "line-clamp-1"}`}>{m.message}</p>
                </div>
                <button onClick={() => setDeleteTarget(m)} className="w-9 h-9 rounded-lg surface-2 flex items-center justify-center text-muted hover:text-rose transition-colors flex-shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete message?"
        description="This message will be permanently removed."
      />
    </div>
  );
}
