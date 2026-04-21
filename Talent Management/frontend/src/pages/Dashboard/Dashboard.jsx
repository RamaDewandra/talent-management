import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import dashboardService from '../../services/dashboardService';
import periodService from '../../services/periodService';
import NineBox from '../../components/ui/NineBox';
import './Dashboard.css';

export function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [nineBoxData, setNineBoxData] = useState(null);
  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPeriods();
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadPeriods = async () => {
    try {
      const response = await periodService.getAll();
      setPeriods(response.data || []);
    } catch (err) {
      console.error('Failed to load periods:', err);
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const periodId = selectedPeriod || null;
      const [summaryRes, nineBoxRes] = await Promise.all([
        dashboardService.getSummary(periodId),
        dashboardService.get9Box(periodId),
      ]);
      setSummary(summaryRes.data);
      setNineBoxData(nineBoxRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="period-filter">
          <label>Assessment Period:</label>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="">All Periods</option>
            {periods.map((period) => (
              <option key={period.id} value={period.id}>
                {period.name} ({period.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {summary && (
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Assessments</h3>
            <p className="summary-value">{summary.total_assessments}</p>
          </div>
          <div className="summary-card">
            <h3>Submitted</h3>
            <p className="summary-value text-success">{summary.submitted_assessments}</p>
          </div>
          <div className="summary-card">
            <h3>Draft</h3>
            <p className="summary-value text-warning">{summary.draft_assessments}</p>
          </div>
          <div className="summary-card">
            <h3>Completion Rate</h3>
            <p className="summary-value">{summary.completion_rate}%</p>
          </div>
        </div>
      )}

      {summary?.active_period && (
        <div className="active-period-banner">
          <strong>Active Period:</strong> {summary.active_period.name} 
          ({summary.active_period.start_date} to {summary.active_period.end_date})
        </div>
      )}

      <div className="dashboard-section">
        <h2>9-Box Talent Matrix</h2>
        {nineBoxData && <NineBox data={nineBoxData} />}
      </div>

      {summary?.category_distribution && Object.keys(summary.category_distribution).length > 0 && (
        <div className="dashboard-section">
          <h2>Category Distribution</h2>
          <div className="category-list">
            {Object.entries(summary.category_distribution).map(([category, count]) => (
              <div key={category} className="category-item">
                <span className="category-name">{category}</span>
                <span className="category-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
