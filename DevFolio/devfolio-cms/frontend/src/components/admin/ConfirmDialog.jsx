import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";

export default function ConfirmDialog({ open, onClose, onConfirm, title, description, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title || "Are you sure?"}>
      <div className="flex items-start gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-rose/10 flex items-center justify-center text-rose flex-shrink-0">
          <AlertTriangle size={16} />
        </div>
        <p className="text-body text-sm">{description}</p>
      </div>
      <div className="flex justify-end gap-2">
        <button className="btn-outline" onClick={onClose}>
          Cancel
        </button>
        <button className="btn-danger" onClick={onConfirm} disabled={loading}>
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}
