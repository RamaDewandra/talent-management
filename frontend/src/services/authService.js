import api, { initializeCsrf } from './api';

export const authService = {
  async login(email, password) {
    await initializeCsrf();
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  async logout() {
    const response = await api.post('/logout');
    return response.data;
  },

  async getMe() {
    const response = await api.get('/me');
    return response.data;
  },
};

export default authService;
