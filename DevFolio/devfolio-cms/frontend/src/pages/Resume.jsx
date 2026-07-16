import { useEffect, useState } from "react";
import { Download, FileWarning, FileText } from "lucide-react";
import api, { assetUrl } from "../api/client";
import { Loader, EmptyState } from "../components/Loader";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Resume() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get("/resume")
      .then((res) => setResume(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = () => {
    window.location.href = `${API_BASE_URL}/api/resume/download`;
  };

  if (loading) return <Loader label="loading resume.pdf" />;

  return (
    <section className="section max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="eyebrow mb-3">resume</span>
          <h1 className="h2-display">My resume</h1>
        </div>
        {!error && (
          <button onClick={handleDownload} className="btn-primary">
            <Download size={15} /> Download PDF
          </button>
        )}
      </div>

      {error ? (
        <EmptyState
          icon={FileWarning}
          title="No resume uploaded yet"
          description="The admin hasn't uploaded a resume yet. Check back soon."
        />
      ) : (
        <div className="surface overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-base bg-black/10">
            <FileText size={14} className="text-cyan" />
            <span className="font-mono text-xs text-muted">{resume.resume_original_name}</span>
          </div>
          <iframe
            title="Resume preview"
            src={`${assetUrl(resume.resume_file)}#view=fitH`}
            className="w-full h-[75vh] bg-white"
          />
        </div>
      )}
    </section>
  );
}
