import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '◈' },
  { path: '/projects', label: 'Projects', icon: '▦' },
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '?';

  return (
    <aside style={{
      width: '260px',
      minHeight: '100vh',
      background: 'rgba(255,255,255,0.02)',
      borderRight: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 30,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 8px', marginBottom: '36px' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          <span className="gradient-text">TaskFlow</span>
        </h1>
        <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
          Team Task Manager
        </p>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              background: isActive ? 'rgba(139, 92, 246, 0.12)' : 'transparent',
              transition: 'all 0.2s ease',
            })}
          >
            <span style={{ fontSize: '1rem' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Card */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px',
        borderRadius: '12px',
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
      }}>
        <div className="avatar" style={{
          background: isAdmin
            ? 'linear-gradient(135deg, var(--color-accent-violet), var(--color-accent-cyan))'
            : 'linear-gradient(135deg, var(--color-accent-emerald), var(--color-accent-cyan))',
          width: '36px',
          height: '36px',
          fontSize: '0.8rem',
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name}
          </div>
          <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-member'}`} style={{ marginTop: '2px', fontSize: '0.6rem', padding: '2px 6px' }}>
            {user?.role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          title="Logout"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            fontSize: '1rem',
            padding: '4px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--color-accent-rose)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--color-text-muted)'}
        >
          ⏻
        </button>
      </div>
    </aside>
  );
}
