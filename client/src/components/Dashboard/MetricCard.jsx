export default function MetricCard({ icon, label, value, color, delay = 0 }) {
  const colorMap = {
    violet: { bg: 'rgba(139, 92, 246, 0.12)', text: 'var(--color-accent-violet)', border: 'rgba(139, 92, 246, 0.2)' },
    amber: { bg: 'rgba(245, 158, 11, 0.12)', text: 'var(--color-accent-amber)', border: 'rgba(245, 158, 11, 0.2)' },
    emerald: { bg: 'rgba(16, 185, 129, 0.12)', text: 'var(--color-accent-emerald)', border: 'rgba(16, 185, 129, 0.2)' },
    rose: { bg: 'rgba(244, 63, 94, 0.12)', text: 'var(--color-accent-rose)', border: 'rgba(244, 63, 94, 0.2)' },
    blue: { bg: 'rgba(59, 130, 246, 0.12)', text: 'var(--color-accent-blue)', border: 'rgba(59, 130, 246, 0.2)' },
    cyan: { bg: 'rgba(6, 182, 212, 0.12)', text: 'var(--color-accent-cyan)', border: 'rgba(6, 182, 212, 0.2)' },
  };

  const c = colorMap[color] || colorMap.violet;

  return (
    <div
      className="glass-card animate-fade-in"
      style={{
        padding: '22px',
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: '6px' }}>
            {label}
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: c.text, lineHeight: 1 }}>
            {value}
          </p>
        </div>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          background: c.bg,
          border: `1px solid ${c.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.3rem',
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}
