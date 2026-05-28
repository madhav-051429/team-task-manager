import { useState } from 'react';
import { projectsAPI } from '../../api/client';

export default function ProjectForm({ project, onClose, onSaved }) {
  const isEdit = !!project;
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await projectsAPI.update(project.id, { name, description });
      } else {
        await projectsAPI.create({ name, description });
      }
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            {isEdit ? 'Edit Project' : 'New Project'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>
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
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="project-name" className="form-label">Project Name</label>
            <input
              id="project-name"
              type="text"
              className="input-field"
              placeholder="Enter project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="project-desc" className="form-label">Description</label>
            <textarea
              id="project-desc"
              className="input-field"
              placeholder="Project description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Saving...' : (isEdit ? 'Update Project' : 'Create Project')}
          </button>
        </form>
      </div>
    </div>
  );
}
