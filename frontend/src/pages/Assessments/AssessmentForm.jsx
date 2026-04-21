import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import assessmentService from '../../services/assessmentService';
import userService from '../../services/userService';
import periodService from '../../services/periodService';
import indicatorService from '../../services/indicatorService';
import './AssessmentForm.css';

export function AssessmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [employees, setEmployees] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [performanceIndicators, setPerformanceIndicators] = useState([]);
  const [potentialIndicators, setPotentialIndicators] = useState([]);
  
  const [formData, setFormData] = useState({
    employee_id: '',
    assessment_period_id: '',
  });
  const [scores, setScores] = useState({});
  const [assessment, setAssessment] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (isEdit) {
      loadAssessment();
    }
  }, [id]);

  const loadInitialData = async () => {
    try {
      const [employeesRes, periodsRes, perfRes, potRes] = await Promise.all([
        userService.getEmployees(),
        periodService.getAll(),
        indicatorService.getPerformanceIndicators(),
        indicatorService.getPotentialIndicators(),
      ]);
      
      setEmployees(employeesRes.data || []);
      setPeriods((periodsRes.data || []).filter(p => p.status === 'active'));
      setPerformanceIndicators((perfRes.data || []).filter(i => i.is_active));
      setPotentialIndicators((potRes.data || []).filter(i => i.is_active));
      
      // Initialize scores
      const initialScores = {};
      (perfRes.data || []).filter(i => i.is_active).forEach(ind => {
        initialScores[`performance_${ind.id}`] = '';
      });
      (potRes.data || []).filter(i => i.is_active).forEach(ind => {
        initialScores[`potential_${ind.id}`] = '';
      });
      setScores(initialScores);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load form data');
      setLoading(false);
    }
  };

  const loadAssessment = async () => {
    try {
      const response = await assessmentService.getById(id);
      const data = response.data;
      setAssessment(data);
      
      setFormData({
        employee_id: data.employee?.id || '',
        assessment_period_id: data.assessment_period?.id || '',
      });

      // Load existing scores
      const existingScores = {};
      (data.scores || []).forEach(score => {
        existingScores[`${score.indicator_type}_${score.indicator_id}`] = score.score;
      });
      setScores(prev => ({ ...prev, ...existingScores }));
    } catch (err) {
      setError('Failed to load assessment');
    }
  };

  const handleScoreChange = (type, indicatorId, value) => {
    setScores(prev => ({
      ...prev,
      [`${type}_${indicatorId}`]: value,
    }));
  };

  const handleSubmit = async (e, shouldSubmit = false) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Prepare scores array
      const scoresArray = [];
      Object.entries(scores).forEach(([key, value]) => {
        if (value !== '' && value !== null) {
          const [type, indicatorId] = key.split('_');
          scoresArray.push({
            indicator_type: type,
            indicator_id: parseInt(indicatorId),
            score: parseFloat(value),
          });
        }
      });

      if (isEdit) {
        await assessmentService.update(id, { scores: scoresArray });
        
        if (shouldSubmit) {
          await assessmentService.submit(id);
        }
      } else {
        const response = await assessmentService.create({
          ...formData,
          scores: scoresArray,
        });
        
        if (shouldSubmit && response.data?.id) {
          await assessmentService.submit(response.data.id);
        }
      }

      navigate('/assessments');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save assessment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  const isSubmitted = assessment?.status === 'submitted';

  return (
    <div className="assessment-form-page">
      <div className="page-header">
        <h1>{isEdit ? (isSubmitted ? 'View Assessment' : 'Edit Assessment') : 'New Assessment'}</h1>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={(e) => handleSubmit(e, false)}>
        <div className="form-section">
          <h2>Basic Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Employee *</label>
              <select
                value={formData.employee_id}
                onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                disabled={isEdit || isSubmitted}
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.department?.name})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Assessment Period *</label>
              <select
                value={formData.assessment_period_id}
                onChange={(e) => setFormData({ ...formData, assessment_period_id: e.target.value })}
                disabled={isEdit || isSubmitted}
                required
              >
                <option value="">Select Period</option>
                {periods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Performance Indicators</h2>
          <p className="section-description">Rate each indicator from 1 (Low) to 5 (High)</p>
          <div className="indicators-grid">
            {performanceIndicators.map((indicator) => (
              <div key={indicator.id} className="indicator-item">
                <div className="indicator-info">
                  <span className="indicator-name">{indicator.name}</span>
                  {indicator.category && (
                    <span className="indicator-category">{indicator.category}</span>
                  )}
                  <span className="indicator-weight">Weight: {indicator.weight}</span>
                </div>
                <div className="score-input">
                  <select
                    value={scores[`performance_${indicator.id}`] || ''}
                    onChange={(e) => handleScoreChange('performance', indicator.id, e.target.value)}
                    disabled={isSubmitted}
                  >
                    <option value="">-</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2>Potential Indicators</h2>
          <p className="section-description">Rate each indicator from 1 (Low) to 5 (High)</p>
          <div className="indicators-grid">
            {potentialIndicators.map((indicator) => (
              <div key={indicator.id} className="indicator-item">
                <div className="indicator-info">
                  <span className="indicator-name">{indicator.name}</span>
                  <span className="indicator-weight">Weight: {indicator.weight}</span>
                </div>
                <div className="score-input">
                  <select
                    value={scores[`potential_${indicator.id}`] || ''}
                    onChange={(e) => handleScoreChange('potential', indicator.id, e.target.value)}
                    disabled={isSubmitted}
                  >
                    <option value="">-</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {assessment && isSubmitted && (
          <div className="form-section results-section">
            <h2>Assessment Results</h2>
            <div className="results-grid">
              <div className="result-item">
                <span className="result-label">Performance Score</span>
                <span className="result-value">{assessment.performance_score}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Potential Score</span>
                <span className="result-value">{assessment.potential_score}</span>
              </div>
              <div className="result-item highlight">
                <span className="result-label">Talent Category</span>
                <span className="result-value">{assessment.talent_category}</span>
              </div>
            </div>
          </div>
        )}

        {!isSubmitted && (
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/assessments')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-secondary"
              disabled={submitting}
            >
              Save as Draft
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={(e) => handleSubmit(e, true)}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Assessment'}
            </button>
          </div>
        )}

        {isSubmitted && (
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/assessments')}
            >
              Back to List
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default AssessmentForm;
