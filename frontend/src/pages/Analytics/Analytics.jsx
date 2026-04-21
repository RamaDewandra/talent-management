import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import analyticsService from '../../services/analyticsService';
import periodService from '../../services/periodService';
import './Analytics.css';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

const CATEGORY_COLORS = {
  'Star':               { bg: 'rgba(16,185,129,0.7)', border: '#10b981' },
  'High Performer':     { bg: 'rgba(52,211,153,0.7)', border: '#34d399' },
  'High Potential':     { bg: 'rgba(59,130,246,0.7)', border: '#3b82f6' },
  'Core Player':        { bg: 'rgba(99,102,241,0.7)', border: '#6366f1' },
  'Solid Performer':    { bg: 'rgba(139,92,246,0.7)', border: '#8b5cf6' },
  'Inconsistent Player':{ bg: 'rgba(245,158,11,0.7)', border: '#f59e0b' },
  'Average Performer':  { bg: 'rgba(251,191,36,0.7)', border: '#fbbf24' },
  'Underperformer':     { bg: 'rgba(239,68,68,0.7)',  border: '#ef4444' },
  'Risk':               { bg: 'rgba(220,38,38,0.7)',  border: '#dc2626' },
};

const chartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { family: 'Inter' } } },
    tooltip: { backgroundColor: '#1e293b', titleColor: '#f8fafc', bodyColor: '#94a3b8', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 },
  },
  scales: {
    x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' }, min: 0, max: 5 },
  },
};

export function Analytics() {
  const [trends, setTrends]   = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [catDist, setCatDist] = useState({});
  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    periodService.getAll().then(r => setPeriods(r.data || []));
    analyticsService.getTrends().then(r => setTrends(r.data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      analyticsService.getDepartmentSummary(selectedPeriod || null),
      analyticsService.getCategoryDistribution(selectedPeriod || null),
    ]).then(([dept, cat]) => {
      setDeptData(dept.data || []);
      setCatDist(cat.data || {});
    }).finally(() => setLoading(false));
  }, [selectedPeriod]);

  // --- Chart configs ---
  const trendLabels = trends.map(t => t.period_name);
  const trendChartData = {
    labels: trendLabels,
    datasets: [
      {
        label: 'Avg Performance',
        data: trends.map(t => t.avg_performance),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.15)',
        tension: 0.4, fill: true, pointRadius: 5, pointBackgroundColor: '#6366f1',
      },
      {
        label: 'Avg Potential',
        data: trends.map(t => t.avg_potential),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139,92,246,0.1)',
        tension: 0.4, fill: true, pointRadius: 5, pointBackgroundColor: '#8b5cf6',
      },
    ],
  };

  const deptLabels = deptData.map(d => d.department_name);
  const deptChartData = {
    labels: deptLabels,
    datasets: [
      {
        label: 'Avg Performance',
        data: deptData.map(d => d.avg_performance),
        backgroundColor: 'rgba(99,102,241,0.7)',
        borderColor: '#6366f1', borderWidth: 1, borderRadius: 6,
      },
      {
        label: 'Avg Potential',
        data: deptData.map(d => d.avg_potential),
        backgroundColor: 'rgba(139,92,246,0.7)',
        borderColor: '#8b5cf6', borderWidth: 1, borderRadius: 6,
      },
    ],
  };

  const catLabels = Object.keys(catDist);
  const catChartData = {
    labels: catLabels,
    datasets: [{
      data: Object.values(catDist),
      backgroundColor: catLabels.map(k => CATEGORY_COLORS[k]?.bg || 'rgba(148,163,184,0.7)'),
      borderColor:     catLabels.map(k => CATEGORY_COLORS[k]?.border || '#94a3b8'),
      borderWidth: 2,
    }],
  };
  const doughnutOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { color: '#94a3b8', font: { family: 'Inter' }, padding: 16 } },
      tooltip: { backgroundColor: '#1e293b', titleColor: '#f8fafc', bodyColor: '#94a3b8', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 },
    },
  };

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics & Trends</h1>
          <p className="page-subtitle">Performance insights across all assessment periods.</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={e => setSelectedPeriod(e.target.value)}
          className="period-select"
        >
          <option value="">All Periods</option>
          {periods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* ---- Trend Line Chart ---- */}
      <div className="glass-card chart-card">
        <h2 className="chart-title">📈 Score Trends per Period</h2>
        <div className="chart-container" style={{ height: 300 }}>
          {trends.length > 0
            ? <Line data={trendChartData} options={chartOpts} />
            : <div className="no-data">No trend data yet.</div>}
        </div>
      </div>

      {/* ---- Department Bar Chart + Doughnut ---- */}
      <div className="charts-row">
        <div className="glass-card chart-card">
          <h2 className="chart-title">🏢 Department Comparison</h2>
          <div className="chart-container" style={{ height: 280 }}>
            {!loading && deptData.length > 0
              ? <Bar data={deptChartData} options={{ ...chartOpts, scales: { ...chartOpts.scales, y: { ...chartOpts.scales.y, min: 0, max: 5 } } }} />
              : <div className="no-data">No data for selected period.</div>}
          </div>
        </div>

        <div className="glass-card chart-card">
          <h2 className="chart-title">🎯 Talent Distribution</h2>
          <div className="chart-container" style={{ height: 280 }}>
            {!loading && catLabels.length > 0
              ? <Doughnut data={catChartData} options={doughnutOpts} />
              : <div className="no-data">No data for selected period.</div>}
          </div>
        </div>
      </div>

      {/* ---- Department Table ---- */}
      <div className="glass-card">
        <h2 className="chart-title" style={{ marginBottom: '1.5rem' }}>🗂️ Department Summary Table</h2>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <div className="spinner" />
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Employees</th>
                  <th>Assessed</th>
                  <th>Avg Performance</th>
                  <th>Avg Potential</th>
                  <th>Top Category</th>
                </tr>
              </thead>
              <tbody>
                {deptData.map(dept => {
                  const topCat = dept.category_distribution && Object.keys(dept.category_distribution).length > 0
                    ? Object.entries(dept.category_distribution).sort((a, b) => b[1] - a[1])[0][0]
                    : '—';
                  return (
                    <tr key={dept.department_id}>
                      <td><strong>{dept.department_name}</strong></td>
                      <td>{dept.total_employees}</td>
                      <td>
                        <span className="badge submitted">{dept.assessed}</span>
                      </td>
                      <td>
                        <div className="score-bar-wrap">
                          <div className="score-bar" style={{ width: `${((dept.avg_performance || 0) / 5) * 100}%`, background: '#6366f1' }} />
                          <span>{dept.avg_performance ?? '—'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="score-bar-wrap">
                          <div className="score-bar" style={{ width: `${((dept.avg_potential || 0) / 5) * 100}%`, background: '#8b5cf6' }} />
                          <span>{dept.avg_potential ?? '—'}</span>
                        </div>
                      </td>
                      <td><span className="badge active">{topCat}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
