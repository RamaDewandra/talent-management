import api from './api';

const alertService = {
  async getAlerts() {
    const res = await api.get('/alerts');
    return res.data;
  }
};

export default alertService;
