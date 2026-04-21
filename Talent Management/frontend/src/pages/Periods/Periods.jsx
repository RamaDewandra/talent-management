import { useState, useEffect } from 'react';
import periodService from '../../services/periodService';
import './Periods.css';

export function Periods() {
  const [periods, setPeriods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [formData, setFormData] = useState({ name: '', start_date: '', end_date: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPeriods();
  }, []);

  const loadPeriods = async () => {
    setLoading(true);
    try {
      const response = await periodService.getAll();
      setPeriods(response.data || []);
    } catch (err) {
      setError('Failed to load periods');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      if (editingPeriod) {
        await periodService.update(editingPeriod.id, formData);
      } else {
        await periodService.create(formData);
      }
      setShowForm(false);
      setEditingPeriod(null);
      setFormData({ name: '', start_date: '', end_date: '' });
      loadPeriods();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save period');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (period) => {
    setEditingPeriod(period);
    setFormData({
      name: period.name,
      start_date: period.start_date,
      end_date: period.end_date,
    });
    setShowForm(true);
  };

  const handleActivate = async (id) => {
    try {
      await periodService.activate(id);
      loadPeriods();
    } catch (err) {
      setError('Failed to activate period');
    }
  };

  const handleClose = async (id) => {
    try {
      await periodService.close(id);
      loadPeriods();
    } catch (err) {
      setError('Failed to close period');
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      draft: 'badge-secondary',
      active: 'badge-success',
      closed: 'badge-warning',
    };
    return <span className={`badge ${classes[status]}`}>{status}</span>;
  };

  return (
    <div className="periods-page">
      <div className="page-header">
        <h1>Assessment Periods</h1>
        <button className="btn btn-primary" onClick={() => {
          setShowForm(true);
          setEditingPeriod(null);
          setFormData({ name: '', start_date: '', end_date: '' });
        }}>
          New Period
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h2>{editingPeriod ? 'Edit Period' : 'New Period'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Q1 2024 Assessment"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date *</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Assessments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {periods.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-state">No periods found</td>
                </tr>
              ) : (
                periods.map((period) => (
                  <tr key={period.id}>
                    <td>{period.name}</td>
                    <td>{period.start_date}</td>
                    <td>{period.end_date}</td>
                    <td>{getStatusBadge(period.status)}</td>
                    <td>{period.assessments_count || 0}</td>
                    <td>
                      <div className="action-buttons">
                        {period.status === 'draft' && (
                          <>
                            <button className="btn btn-sm" onClick={() => handleEdit(period)}>
                              Edit
                            </button>
                            <button className="btn btn-sm btn-success" onClick={() => handleActivate(period.id)}>
                              Activate
                            </button>
                          </>
                        )}
                        {period.status === 'active' && (
                          <button className="btn btn-sm btn-warning" onClick={() => handleClose(period.id)}>
                            Close
                          </button>
                        )}
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

export default Periods;
