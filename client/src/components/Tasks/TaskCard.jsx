import StatusBadge from './StatusBadge';

const avatarColors = [
  'linear-gradient(135deg, #8b5cf6, #06b6d4)',
  'linear-gradient(135deg, #10b981, #06b6d4)',
  'linear-gradient(135deg, #f59e0b, #f43f5e)',
  'linear-gradient(135deg, #3b82f6, #8b5cf6)',
  'linear-gradient(135deg, #f43f5e, #f59e0b)',
];

export default function TaskCard({ task, onClick, isOverdue }) {
  const initials = task.assignee?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '?';

  const colorIndex = task.assignee?.name
    ? task.assignee.name.charCodeAt(0) % avatarColors.length
    : 0;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      onClick={() => onClick?.(task)}
      className="glass-card"
      style={{
        padding: '16px',
        cursor: 'pointer',
        borderLeft: isOverdue ? '3px solid var(--color-accent-rose)' : '3px solid transparent',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
        <h4 style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          lineHeight: 1.3,
          color: isOverdue ? 'var(--color-accent-rose)' : 'var(--color-text-primary)',
        }}>
          {task.title}
        </h4>
      </div>

      {task.description && (
        <p style={{
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          marginBottom: '10px',
          lineHeight: 1.4,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {task.description}
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {task.assignee && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div className="avatar" style={{ background: avatarColors[colorIndex], width: '22px', height: '22px', fontSize: '0.55rem' }}>
                {initials}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                {task.assignee.name.split(' ')[0]}
              </span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {task.dueDate && (
            <span style={{
              fontSize: '0.65rem',
              color: isOverdue ? 'var(--color-accent-rose)' : 'var(--color-text-muted)',
              fontWeight: isOverdue ? 600 : 400,
            }}>
              📅 {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      {isOverdue && (
        <div className="badge badge-overdue" style={{ marginTop: '8px', fontSize: '0.6rem' }}>
          ⚠ Overdue
        </div>
      )}
    </div>
  );
}
