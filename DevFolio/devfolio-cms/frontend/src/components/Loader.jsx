export function Loader({ label = "loading" }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="flex gap-1.5">
        <span className="w-2 h-2 rounded-full bg-cyan animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 rounded-full bg-violet animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 rounded-full bg-amber animate-bounce" />
      </div>
      <span className="font-mono text-xs text-muted">{label}...</span>
    </div>
  );
}

export function EmptyState({ title, description, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 surface">
      {Icon && (
        <div className="w-12 h-12 rounded-lg surface-2 flex items-center justify-center mb-4 text-cyan">
          <Icon size={22} />
        </div>
      )}
      <h3 className="font-display font-semibold text-heading text-lg mb-1">{title}</h3>
      {description && <p className="text-muted text-sm max-w-sm">{description}</p>}
    </div>
  );
}
