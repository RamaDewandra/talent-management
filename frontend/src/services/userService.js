import api from './api';

export const userService = {
  async getEmployees() {
    const response = await api.get('/employees');
    return response.data;
  },

  async getDepartments() {
    const response = await api.get('/departments');
    return response.data;
  },
};

export default userService;
