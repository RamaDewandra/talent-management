import api from './api';

export const periodService = {
  async getAll() {
    const response = await api.get('/periods');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/periods/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/periods', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/periods/${id}`, data);
    return response.data;
  },

  async activate(id) {
    const response = await api.post(`/periods/${id}/activate`);
    return response.data;
  },

  async close(id) {
    const response = await api.post(`/periods/${id}/close`);
    return response.data;
  },
};

export default periodService;
