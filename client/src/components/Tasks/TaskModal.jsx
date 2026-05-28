import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { tasksAPI, authAPI } from '../../api/client';

export default function TaskModal({ task, projectId, onClose, onSaved }) {
  const { isAdmin } = useAuth();
  const isEdit = !!task;

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState(task?.status || 'TODO');
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId || '');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdmin) {
      authAPI.getUsers().then((res) => setUsers(res.data.data.users)).catch(() => {});
    }
  }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isAdmin && isEdit) {
        // Admin full update
        await tasksAPI.update(task.id, {
          title,
          description,
          status,
          dueDate: dueDate || null,
          assigneeId: assigneeId || null,
        });
      } else if (isAdmin && !isEdit) {
        // Admin create
        if (!title.trim()) {
          setError('Title is required');
          setLoading(false);
          return;
        }
        await tasksAPI.create({
          title,
          description,
          status,
          dueDate: dueDate || null,
          projectId,
          assigneeId: assigneeId || null,
        });
      } else {
        // Member: only update status
        await tasksAPI.updateStatus(task.id, status);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setLoading(true);
    try {
      await tasksAPI.delete(task.id);
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            {isEdit ? (isAdmin ? 'Edit Task' : 'Update Status') : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            color: 'var(--color-accent-rose)',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            marginBottom: '18px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Admin can edit all fields, Member only status */}
          {isAdmin && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="task-title" className="form-label">Title</label>
                <input
                  id="task-title"
                  type="text"
                  className="input-field"
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="task-desc" className="form-label">Description</label>
                <textarea
                  id="task-desc"
                  className="input-field"
                  placeholder="Task description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label htmlFor="task-due" className="form-label">Due Date</label>
                  <input
                    id="task-due"
                    type="date"
                    className="input-field"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="task-assignee" className="form-label">Assignee</label>
                  <select
                    id="task-assignee"
                    className="input-field"
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="task-status" className="form-label">Status</label>
            <select
              id="task-status"
              className="input-field"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
              {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Task')}
            </button>
            {isEdit && isAdmin && (
              <button type="button" className="btn-danger" onClick={handleDelete} disabled={loading}>
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
