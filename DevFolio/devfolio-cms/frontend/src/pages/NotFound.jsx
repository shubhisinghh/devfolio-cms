import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="section flex flex-col items-center text-center py-32">
      <div className="surface px-6 py-4 mb-8 font-mono text-sm text-left w-full max-w-md">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-base">
          <span className="editor-dot bg-rose" />
          <span className="editor-dot bg-amber" />
          <span className="editor-dot bg-cyan" />
          <span className="ml-2 text-muted text-xs">error.log</span>
        </div>
        <div className="text-rose">Uncaught Error: Route not found</div>
        <div className="text-muted mt-1">
          at <span className="text-violet">router</span>.<span className="text-cyan">resolve</span>(
          <span className="text-amber">'{window.location.pathname}'</span>)
        </div>
      </div>
      <h1 className="font-display text-6xl font-semibold text-heading mb-3">404</h1>
      <p className="text-body mb-8">This page doesn't exist — or it moved somewhere I forgot to update.</p>
      <Link to="/" className="btn-primary">
        <ArrowLeft size={15} /> Back to home
      </Link>
    </section>
  );
}
