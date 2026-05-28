export default function DeadlineList({ tasks }) {
  const now = new Date();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const diff = date - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return { text: `${Math.abs(days)}d overdue`, isOverdue: true };
    if (days === 0) return { text: 'Due today', isOverdue: true };
    if (days === 1) return { text: 'Due tomorrow', isOverdue: false };
    return { text: `${days}d left`, isOverdue: false };
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
        No upcoming deadlines 🎉
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {tasks.map((task, i) => {
        const dateInfo = task.dueDate ? formatDate(task.dueDate) : null;
        return (
          <div
            key={task.id}
            className="animate-fade-in"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderBottom: i < tasks.length - 1 ? '1px solid var(--color-border)' : 'none',
              animationDelay: `${i * 60}ms`,
              animationFillMode: 'both',
            }}
          >
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: dateInfo?.isOverdue ? 'var(--color-accent-rose)' : 'var(--color-accent-amber)',
              flexShrink: 0,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: dateInfo?.isOverdue ? 'var(--color-accent-rose)' : 'var(--color-text-primary)',
              }}>
                {task.title}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                {task.project?.name} {task.assignee && `• ${task.assignee.name}`}
              </div>
            </div>
            {dateInfo && (
              <span className={`badge ${dateInfo.isOverdue ? 'badge-overdue' : 'badge-progress'}`}>
                {dateInfo.text}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
