import { useEffect, useState } from "react";
import { Upload, FileText, Download, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import api, { assetUrl } from "../../api/client";
import { Loader } from "../../components/Loader";

export default function ManageResume() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get("/resume")
      .then((res) => setResume(res.data))
      .catch(() => setResume(null))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Choose a PDF file first");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("resume", file);
      await api.post("/resume", fd);
      toast.success("Resume uploaded — it's now live on the site");
      setFile(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loader label="loading resume" />;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <span className="eyebrow mb-2">manage</span>
        <h1 className="h2-display">Resume</h1>
      </div>

      {resume && (
        <div className="surface p-5 mb-6 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-cyan/10 flex items-center justify-center text-cyan flex-shrink-0">
            <CheckCircle2 size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-heading text-sm font-medium truncate">{resume.resume_original_name}</p>
            <p className="font-mono text-[11px] text-muted">
              Uploaded {new Date(resume.resume_uploaded_at).toLocaleString()}
            </p>
          </div>
          <a href={assetUrl(resume.resume_file)} target="_blank" rel="noreferrer" className="btn-outline !text-xs !py-2">
            <Download size={13} /> View
          </a>
        </div>
      )}

      <form onSubmit={handleUpload} className="surface p-6">
        <label className="font-mono text-xs text-muted mb-2 block">
          {resume ? "Replace resume (PDF)" : "Upload resume (PDF)"}
        </label>
        <div className="border border-dashed border-base rounded-lg p-8 flex flex-col items-center text-center mb-4">
          <FileText size={28} className="text-cyan mb-3" />
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="font-mono text-xs text-body"
          />
          {file && <p className="font-mono text-xs text-cyan mt-2">{file.name}</p>}
        </div>
        <button type="submit" disabled={uploading} className="btn-primary w-full">
          <Upload size={15} /> {uploading ? "Uploading..." : "Upload resume"}
        </button>
        <p className="text-muted text-xs mt-3">
          The newly uploaded file automatically replaces the one shown on your public Resume page.
        </p>
      </form>
    </div>
  );
}
