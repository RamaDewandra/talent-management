import api from './api';

export const dashboardService = {
  async getSummary(periodId = null) {
    const params = periodId ? { period_id: periodId } : {};
    const response = await api.get('/dashboard/summary', { params });
    return response.data;
  },

  async get9Box(periodId = null) {
    const params = periodId ? { period_id: periodId } : {};
    const response = await api.get('/dashboard/9box', { params });
    return response.data;
  },
};

export default dashboardService;
