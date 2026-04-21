import api from './api';

const analyticsService = {
  async getTrends() {
    const res = await api.get('/analytics/trends');
    return res.data;
  },
  async getDepartmentSummary(periodId = null) {
    const res = await api.get('/analytics/department-summary', {
      params: periodId ? { period_id: periodId } : {},
    });
    return res.data;
  },
  async getCategoryDistribution(periodId = null) {
    const res = await api.get('/analytics/category-distribution', {
      params: periodId ? { period_id: periodId } : {},
    });
    return res.data;
  },
};

export default analyticsService;
