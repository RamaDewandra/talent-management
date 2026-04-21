import api from './api';

const userManagementService = {
  async getAll() {
    const res = await api.get('/manage/users');
    return res.data;
  },
  async getRoles() {
    const res = await api.get('/manage/roles');
    return res.data;
  },
  async getDepartments() {
    const res = await api.get('/manage/departments-list');
    return res.data;
  },
  async create(data) {
    const res = await api.post('/manage/users', data);
    return res.data;
  },
  async update(id, data) {
    const res = await api.put(`/manage/users/${id}`, data);
    return res.data;
  },
  async delete(id) {
    const res = await api.delete(`/manage/users/${id}`);
    return res.data;
  }
};

export default userManagementService;
