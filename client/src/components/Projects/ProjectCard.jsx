import { Link } from 'react-router-dom';

const gradients = [
  'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.1))',
  'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.1))',
  'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(244,63,94,0.1))',
  'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))',
];

export default function ProjectCard({ project, index = 0 }) {
  const gradient = gradients[index % gradients.length];

  return (
    <Link
      to={`/projects/${project.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div
        className="glass-card animate-fade-in"
        style={{
          padding: '22px',
          background: gradient,
          animationDelay: `${index * 80}ms`,
          animationFillMode: 'both',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.3 }}>
            {project.name}
          </h3>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
            {project.totalTasks} tasks
          </span>
        </div>

        {project.description && (
          <p style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '16px',
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {project.description}
          </p>
        )}

        {/* Progress Bar */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Progress</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              {project.progress}%
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${project.progress}%` }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
            by {project.owner?.name || 'Unknown'}
          </span>
          <span style={{
            fontSize: '0.7rem',
            color: 'var(--color-accent-violet)',
            fontWeight: 500,
          }}>
            {project.completedTasks}/{project.totalTasks} done
          </span>
        </div>
      </div>
    </Link>
  );
}
