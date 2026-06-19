import api from './api';

export const dashboardApi = {
  getOwnerDashboard: () => api.get('/dashboard'),
  getStudentDashboard: () => api.get('/resident-dashboard'),
};

export default dashboardApi;
