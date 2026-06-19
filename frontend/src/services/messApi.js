import api from './api';

export const messApi = {
  createMess: (data) => api.post('/mess/create', data),
  joinMess: (joinCode) => api.post('/mess/join', { joinCode }),
  getMessDetails: (id) => api.get(`/mess/${id}`),
  getAllMesses: () => api.get('/mess/all'),
};

export default messApi;
