import api from './api';

export const menuApi = {
  updateMenu: (data) => api.post('/menu/update', data),
  getTodayMenu: () => api.get('/menu/today'),
  getWeeklyMenu: () => api.get('/menu/weekly'),
  updateWeeklyMenu: (weeklyMenu) => api.post('/menu/weekly/update', { weeklyMenu }),
};

export default menuApi;
