export default function StatCard({ label, value, icon: Icon, accent = "cyan" }) {
  const accentMap = {
    cyan: "text-cyan",
    amber: "text-amber",
    violet: "text-violet",
    rose: "text-rose",
  };

  return (
    <div className="surface p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-xs text-muted">{label}</span>
        <div className={`w-8 h-8 rounded-md surface-2 flex items-center justify-center ${accentMap[accent]}`}>
          <Icon size={15} />
        </div>
      </div>
      <div className="font-display text-3xl font-semibold text-heading">{value}</div>
    </div>
  );
}
