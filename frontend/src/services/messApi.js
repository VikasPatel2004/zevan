import api from './api';

export const messApi = {
  createMess: async (messData) => {
    return api.post('/mess/create', messData);
  },

  joinMess: async (joinCode) => {
    return api.post('/mess/join', { joinCode });
  },

  getAllMesses: async () => {
    return api.get('/mess/all');
  },

  getMyMess: async () => {
    return api.get('/mess/my');
  },

  getMessById: async (id) => {
    return api.get(`/mess/${id}`);
  },

  updateMess: async (messData) => {
    return api.put('/mess/update', messData);
  },

  getSimilarMesses: async (id) => {
    return api.get(`/mess/${id}/similar`);
  }
};
