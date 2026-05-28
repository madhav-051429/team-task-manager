import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '420px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
          <span className="gradient-text">Create account</span>
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          Join your team on TaskFlow
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
          <label htmlFor="register-name" className="form-label">Full Name</label>
          <input
            id="register-name"
            type="text"
            className="input-field"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label htmlFor="register-email" className="form-label">Email</label>
          <input
            id="register-email"
            type="email"
            className="input-field"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label htmlFor="register-password" className="form-label">Password</label>
          <input
            id="register-password"
            type="password"
            className="input-field"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="register-role" className="form-label">Role</label>
          <select
            id="register-role"
            className="input-field"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-accent-violet)', textDecoration: 'none', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
