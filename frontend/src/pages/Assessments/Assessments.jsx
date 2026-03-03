import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import assessmentService from '../../services/assessmentService';
import periodService from '../../services/periodService';
import './Assessments.css';

export function Assessments() {
  const { isHR } = useAuth();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [filters, setFilters] = useState({ period_id: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPeriods();
  }, []);

  useEffect(() => {
    loadAssessments();
  }, [filters]);

  const loadPeriods = async () => {
    try {
      const response = await periodService.getAll();
      setPeriods(response.data || []);
    } catch (err) {
      console.error('Failed to load periods:', err);
    }
  };

  const loadAssessments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.period_id) params.period_id = filters.period_id;
      if (filters.status) params.status = filters.status;
      
      const response = await assessmentService.getAll(params);
      setAssessments(response.data || []);
    } catch (err) {
      setError('Failed to load assessments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      draft: 'badge-warning',
      submitted: 'badge-success',
    };
    return <span className={`badge ${classes[status]}`}>{status}</span>;
  };

  return (
    <div className="assessments-page">
      <div className="page-header">
        <h1>Assessments</h1>
        <Link to="/assessments/new" className="btn btn-primary">
          New Assessment
        </Link>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label>Period:</label>
          <select
            value={filters.period_id}
            onChange={(e) => setFilters({ ...filters, period_id: e.target.value })}
          >
            <option value="">All Periods</option>
            {periods.map((period) => (
              <option key={period.id} value={period.id}>
                {period.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
          </select>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading assessments...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Period</th>
                <th>Status</th>
                <th>Performance</th>
                <th>Potential</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assessments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    No assessments found
                  </td>
                </tr>
              ) : (
                assessments.map((assessment) => (
                  <tr key={assessment.id}>
                    <td>{assessment.employee?.name}</td>
                    <td>{assessment.employee?.department?.name || '-'}</td>
                    <td>{assessment.assessment_period?.name}</td>
                    <td>{getStatusBadge(assessment.status)}</td>
                    <td>{assessment.performance_score ?? '-'}</td>
                    <td>{assessment.potential_score ?? '-'}</td>
                    <td>{assessment.talent_category || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm"
                          onClick={() => navigate(`/assessments/${assessment.id}`)}
                        >
                          {assessment.status === 'draft' ? 'Edit' : 'View'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Assessments;
