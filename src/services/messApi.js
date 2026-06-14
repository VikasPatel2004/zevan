import api from './api';

export const messApi = {
  getAll: (params) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/messes?${query}`);
  },
  getById: (id) => api.get(`/messes/${id}`),
  create: (data) => api.post('/messes', data),
  update: (id, data) => api.put(`/messes/${id}`, data),
  delete: (id) => api.delete(`/messes/${id}`),
  addReview: (id, review) => api.post(`/messes/${id}/reviews`, review),
};

export default messApi;
