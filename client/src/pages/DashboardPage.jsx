import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../api/client';
import MetricCard from '../components/Dashboard/MetricCard';
import DeadlineList from '../components/Dashboard/DeadlineList';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.get()
      .then((res) => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
        <div className="gradient-text" style={{ fontSize: '1rem', fontWeight: 600 }}>Loading dashboard...</div>
      </div>
    );
  }

  const metrics = data?.metrics || {};

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>
          Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          {isAdmin ? 'Here\'s an overview of all team activity' : 'Here\'s your personal task overview'}
        </p>
      </div>

      {/* Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <MetricCard icon="📋" label="Total Tasks" value={metrics.totalTasks} color="violet" delay={0} />
        <MetricCard icon="🔵" label="To Do" value={metrics.todoTasks} color="blue" delay={60} />
        <MetricCard icon="🔶" label="In Progress" value={metrics.inProgressTasks} color="amber" delay={120} />
        <MetricCard icon="✅" label="Completed" value={metrics.completedTasks} color="emerald" delay={180} />
        <MetricCard icon="🔴" label="Overdue" value={metrics.overdueTasks} color="rose" delay={240} />
      </div>

      {/* Bottom Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isAdmin ? '1fr 1fr' : '1fr',
        gap: '20px',
      }}>
        {/* Upcoming Deadlines */}
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>⏰ Upcoming Deadlines</h3>
          </div>
          <DeadlineList tasks={data?.upcomingDeadlines} />
        </div>

        {/* Project Overview (Admin only) */}
        {isAdmin && data?.projectOverview?.length > 0 && (
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>📊 Project Overview</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {data.projectOverview.map((p, i) => (
                <div
                  key={p.id}
                  style={{
                    padding: '14px 20px',
                    borderBottom: i < data.projectOverview.length - 1 ? '1px solid var(--color-border)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{p.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                      {p.completedTasks}/{p.totalTasks} done
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {!isAdmin && data?.recentTasks?.length > 0 && (
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>📝 Recent Tasks</h3>
            </div>
            <DeadlineList tasks={data.recentTasks} />
          </div>
        )}
      </div>
    </div>
  );
}
