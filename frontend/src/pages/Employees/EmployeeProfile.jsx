import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, RadialLinearScale, Filler, Title, Tooltip, Legend,
} from 'chart.js';
import { Line, Radar } from 'react-chartjs-2';
import employeeProfileService from '../../services/employeeProfileService';
import './EmployeeProfile.css';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  RadialLinearScale, Filler, Title, Tooltip, Legend
);

const CATEGORY_COLOR = {
  'Star': '#10b981', 'High Performer': '#34d399', 'High Potential': '#3b82f6',
  'Core Player': '#6366f1', 'Solid Performer': '#8b5cf6',
  'Inconsistent Player': '#f59e0b', 'Average Performer': '#fbbf24',
  'Underperformer': '#ef4444', 'Risk': '#dc2626',
};

export function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    employeeProfileService.getProfile(id)
      .then(r => setProfile(r.data))
      .catch(() => setError('Employee not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const getInitials = (name) => name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  if (loading) return <div className="loading-state"><div className="spinner" /></div>;
  if (error)   return <div className="error-banner">{error}</div>;
  if (!profile) return null;

  const { employee, history, latest_category, latest_performance, latest_potential } = profile;
  const catColor = CATEGORY_COLOR[latest_category] || '#94a3b8';

  // Trend chart
  const trendData = {
    labels: history.map(h => h.period_name),
    datasets: [
      {
        label: 'Performance',
        data: history.map(h => h.performance_score),
        borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.15)',
        tension: 0.4, fill: true, pointRadius: 5, pointBackgroundColor: '#6366f1',
      },
      {
        label: 'Potential',
        data: history.map(h => h.potential_score),
        borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.1)',
        tension: 0.4, fill: true, pointRadius: 5, pointBackgroundColor: '#8b5cf6',
      },
    ],
  };
  const trendOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#94a3b8' } }, tooltip: { backgroundColor: '#1e293b', titleColor: '#f8fafc', bodyColor: '#94a3b8' } },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { min: 0, max: 5, ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  };

  return (
    <div className="profile-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      {/* Header Card */}
      <div className="glass-card profile-header">
        <div className="profile-avatar">{getInitials(employee.name)}</div>
        <div className="profile-meta">
          <h1 className="profile-name">{employee.name}</h1>
          <div className="profile-dept">{employee.department?.name || '—'}</div>
          <div className="profile-email">{employee.email}</div>
        </div>
        <div className="profile-category-badge" style={{ borderColor: catColor, color: catColor }}>
          <span className="cat-label">Current Status</span>
          <span className="cat-value">{latest_category || 'No Assessment'}</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="glass-card stat-card">
          <span className="stat-label">Latest Performance</span>
          <span className="stat-value" style={{ color: '#6366f1' }}>{latest_performance ?? '—'}</span>
          <span className="stat-unit">/ 5.00</span>
        </div>
        <div className="glass-card stat-card">
          <span className="stat-label">Latest Potential</span>
          <span className="stat-value" style={{ color: '#8b5cf6' }}>{latest_potential ?? '—'}</span>
          <span className="stat-unit">/ 5.00</span>
        </div>
        <div className="glass-card stat-card">
          <span className="stat-label">Total Assessments</span>
          <span className="stat-value">{history.length}</span>
          <span className="stat-unit">periods</span>
        </div>
      </div>

      {/* Trend Chart */}
      {history.length > 0 && (
        <div className="glass-card">
          <h2 className="chart-title">📈 Score Trend Over Time</h2>
          <div style={{ height: 280 }}>
            <Line data={trendData} options={trendOpts} />
          </div>
        </div>
      )}

      {/* Assessment History Table */}
      <div className="glass-card">
        <h2 className="chart-title" style={{ marginBottom: '1rem' }}>📋 Assessment History</h2>
        {history.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No submitted assessments yet.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Performance</th>
                  <th>Potential</th>
                  <th>Talent Category</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i}>
                    <td><strong>{h.period_name}</strong></td>
                    <td><span className="score-chip perf">{h.performance_score}</span></td>
                    <td><span className="score-chip pot">{h.potential_score}</span></td>
                    <td>
                      <span className="category-chip" style={{ color: CATEGORY_COLOR[h.talent_category] || '#94a3b8', borderColor: CATEGORY_COLOR[h.talent_category] || '#94a3b8' }}>
                        {h.talent_category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeProfile;
