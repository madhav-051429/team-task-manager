export default function StatusBadge({ status }) {
  const map = {
    TODO: { className: 'badge-todo', label: 'To Do' },
    IN_PROGRESS: { className: 'badge-progress', label: 'In Progress' },
    DONE: { className: 'badge-done', label: 'Done' },
  };

  const info = map[status] || map.TODO;

  return <span className={`badge ${info.className}`}>{info.label}</span>;
}
