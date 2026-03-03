import api from './api';

export const assessmentService = {
  async getAll(params = {}) {
    const response = await api.get('/assessments', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/assessments/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/assessments', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/assessments/${id}`, data);
    return response.data;
  },

  async submit(id) {
    const response = await api.post(`/assessments/${id}/submit`);
    return response.data;
  },
};

export default assessmentService;
