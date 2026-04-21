import api from './api';

const employeeProfileService = {
  async getAll() {
    const res = await api.get('/employees/all');
    return res.data;
  },
  async getProfile(id) {
    const res = await api.get(`/employees/${id}/profile`);
    return res.data;
  },
};

export default employeeProfileService;
