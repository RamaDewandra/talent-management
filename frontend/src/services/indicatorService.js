import api from './api';

export const indicatorService = {
  async getPerformanceIndicators() {
    const response = await api.get('/performance-indicators');
    return response.data;
  },

  async getPotentialIndicators() {
    const response = await api.get('/potential-indicators');
    return response.data;
  },

  async createPerformanceIndicator(data) {
    const response = await api.post('/performance-indicators', data);
    return response.data;
  },

  async updatePerformanceIndicator(id, data) {
    const response = await api.put(`/performance-indicators/${id}`, data);
    return response.data;
  },

  async deletePerformanceIndicator(id) {
    const response = await api.delete(`/performance-indicators/${id}`);
    return response.data;
  },

  async createPotentialIndicator(data) {
    const response = await api.post('/potential-indicators', data);
    return response.data;
  },

  async updatePotentialIndicator(id, data) {
    const response = await api.put(`/potential-indicators/${id}`, data);
    return response.data;
  },

  async deletePotentialIndicator(id) {
    const response = await api.delete(`/potential-indicators/${id}`);
    return response.data;
  },
};

export default indicatorService;
