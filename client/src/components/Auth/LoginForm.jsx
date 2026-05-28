import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '420px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
          <span className="gradient-text">Welcome back</span>
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          Sign in to your TaskFlow account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '32px' }}>
        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            color: 'var(--color-accent-rose)',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            marginBottom: '20px',
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '18px' }}>
          <label htmlFor="login-email" className="form-label">Email</label>
          <input
            id="login-email"
            type="email"
            className="input-field"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="login-password" className="form-label">Password</label>
          <input
            id="login-password"
            type="password"
            className="input-field"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--color-accent-violet)', textDecoration: 'none', fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </form>

      {/* Demo credentials hint */}
      <div style={{
        marginTop: '20px',
        padding: '14px',
        borderRadius: '10px',
        background: 'rgba(139, 92, 246, 0.06)',
        border: '1px solid rgba(139, 92, 246, 0.15)',
        fontSize: '0.75rem',
        color: 'var(--color-text-muted)',
      }}>
        <strong style={{ color: 'var(--color-accent-violet)' }}>Demo Credentials:</strong>
        <div style={{ marginTop: '6px' }}>Admin: admin@team.com / admin123</div>
        <div>Member: alice@team.com / member123</div>
      </div>
    </div>
  );
}
