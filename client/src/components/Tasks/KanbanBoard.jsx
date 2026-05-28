import TaskCard from './TaskCard';

const columns = [
  { status: 'TODO', label: 'To Do', color: 'var(--color-accent-blue)', dotColor: '#3b82f6' },
  { status: 'IN_PROGRESS', label: 'In Progress', color: 'var(--color-accent-amber)', dotColor: '#f59e0b' },
  { status: 'DONE', label: 'Done', color: 'var(--color-accent-emerald)', dotColor: '#10b981' },
];

export default function KanbanBoard({ tasks, onTaskClick }) {
  const now = new Date();

  const isOverdue = (task) => {
    return task.dueDate && new Date(task.dueDate) < now && task.status !== 'DONE';
  };

  return (
    <div style={{
      display: 'flex',
      gap: '20px',
      overflowX: 'auto',
      paddingBottom: '12px',
    }}>
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);
        return (
          <div key={col.status} className="kanban-column">
            {/* Column Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              padding: '0 4px',
            }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: col.dotColor,
                boxShadow: `0 0 8px ${col.dotColor}40`,
              }} />
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                {col.label}
              </span>
              <span style={{
                fontSize: '0.7rem',
                color: 'var(--color-text-muted)',
                background: 'var(--color-bg-card)',
                padding: '2px 8px',
                borderRadius: '10px',
              }}>
                {colTasks.length}
              </span>
            </div>

            {/* Task Cards */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              minHeight: '120px',
              padding: '12px',
              background: 'rgba(255,255,255,0.015)',
              borderRadius: '12px',
              border: '1px dashed var(--color-border)',
            }}>
              {colTasks.length === 0 ? (
                <div style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.75rem',
                }}>
                  No tasks
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={onTaskClick}
                    isOverdue={isOverdue(task)}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
