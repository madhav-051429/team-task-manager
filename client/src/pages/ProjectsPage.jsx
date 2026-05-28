import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectsAPI } from '../api/client';
import ProjectCard from '../components/Projects/ProjectCard';
import ProjectForm from '../components/Projects/ProjectForm';

export default function ProjectsPage() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchProjects = () => {
    setLoading(true);
    projectsAPI.getAll()
      .then((res) => setProjects(res.data.data.projects))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
        <div className="gradient-text" style={{ fontSize: '1rem', fontWeight: 600 }}>Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '4px' }}>Projects</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
            {isAdmin ? 'Manage all team projects' : 'Your assigned projects'}
          </p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + New Project
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="glass-card" style={{
          padding: '48px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '2rem', marginBottom: '12px' }}>📁</p>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            {isAdmin ? 'No projects yet. Create your first one!' : 'No projects assigned to you yet.'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px',
        }}>
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      )}

      {/* Project Form Modal */}
      {showForm && (
        <ProjectForm
          onClose={() => setShowForm(false)}
          onSaved={fetchProjects}
        />
      )}
    </div>
  );
}
