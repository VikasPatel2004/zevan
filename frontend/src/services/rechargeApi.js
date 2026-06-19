import api from './api';

export const rechargeApi = {
  addRecharge: (data) => api.post('/recharge/add', data),
  getRechargeHistory: () => api.get('/recharge/history'),
  getResidentThaliStatus: () => api.get('/recharge/residents'),
};

export default rechargeApi;
