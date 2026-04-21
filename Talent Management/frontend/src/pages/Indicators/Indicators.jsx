import { useState, useEffect } from 'react';
import indicatorService from '../../services/indicatorService';
import './Indicators.css';

export function Indicators() {
  const [activeTab, setActiveTab] = useState('performance');
  const [performanceIndicators, setPerformanceIndicators] = useState([]);
  const [potentialIndicators, setPotentialIndicators] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: '', weight: '1.0', is_active: true });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadIndicators();
  }, []);

  const loadIndicators = async () => {
    setLoading(true);
    try {
      const [perfRes, potRes] = await Promise.all([
        indicatorService.getPerformanceIndicators(),
        indicatorService.getPotentialIndicators(),
      ]);
      setPerformanceIndicators(perfRes.data || []);
      setPotentialIndicators(potRes.data || []);
    } catch (err) {
      setError('Failed to load indicators');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const data = {
        name: formData.name,
        weight: parseFloat(formData.weight),
        is_active: formData.is_active,
      };

      if (activeTab === 'performance') {
        data.category = formData.category;
        if (editingIndicator) {
          await indicatorService.updatePerformanceIndicator(editingIndicator.id, data);
        } else {
          await indicatorService.createPerformanceIndicator(data);
        }
      } else {
        if (editingIndicator) {
          await indicatorService.updatePotentialIndicator(editingIndicator.id, data);
        } else {
          await indicatorService.createPotentialIndicator(data);
        }
      }

      setShowForm(false);
      setEditingIndicator(null);
      resetForm();
      loadIndicators();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save indicator');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (indicator) => {
    setEditingIndicator(indicator);
    setFormData({
      name: indicator.name,
      category: indicator.category || '',
      weight: indicator.weight.toString(),
      is_active: indicator.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (indicator) => {
    if (!confirm('Are you sure you want to delete this indicator?')) return;

    try {
      if (activeTab === 'performance') {
        await indicatorService.deletePerformanceIndicator(indicator.id);
      } else {
        await indicatorService.deletePotentialIndicator(indicator.id);
      }
      loadIndicators();
    } catch (err) {
      setError('Failed to delete indicator');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', category: '', weight: '1.0', is_active: true });
  };

  const currentIndicators = activeTab === 'performance' ? performanceIndicators : potentialIndicators;

  return (
    <div className="indicators-page">
      <div className="page-header">
        <h1>Indicators Management</h1>
        <button className="btn btn-primary" onClick={() => {
          setShowForm(true);
          setEditingIndicator(null);
          resetForm();
        }}>
          New Indicator
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance Indicators
        </button>
        <button
          className={`tab ${activeTab === 'potential' ? 'active' : ''}`}
          onClick={() => setActiveTab('potential')}
        >
          Potential Indicators
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h2>{editingIndicator ? 'Edit Indicator' : 'New Indicator'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter indicator name"
                required
              />
            </div>
            {activeTab === 'performance' && (
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Work Output, Soft Skills"
                />
              </div>
            )}
            <div className="form-row">
              <div className="form-group">
                <label>Weight *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="10"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.is_active.toString()}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
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
                {activeTab === 'performance' && <th>Category</th>}
                <th>Weight</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentIndicators.length === 0 ? (
                <tr>
                  <td colSpan={activeTab === 'performance' ? 5 : 4} className="empty-state">
                    No indicators found
                  </td>
                </tr>
              ) : (
                currentIndicators.map((indicator) => (
                  <tr key={indicator.id}>
                    <td>{indicator.name}</td>
                    {activeTab === 'performance' && <td>{indicator.category || '-'}</td>}
                    <td>{indicator.weight}</td>
                    <td>
                      <span className={`badge ${indicator.is_active ? 'badge-success' : 'badge-secondary'}`}>
                        {indicator.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-sm" onClick={() => handleEdit(indicator)}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(indicator)}>
                          Delete
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

export default Indicators;
