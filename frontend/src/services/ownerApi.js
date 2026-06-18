import api from './api';

export const ownerApi = {
  getProfile: () => api.get('/owner/profile'),
  getStudents: () => api.get('/owner/students'),
  addStudent: (studentData) => api.post('/owner/students', studentData),
  getBilling: (month, year) => api.get(`/owner/billing?month=${month}&year=${year}`),
  markBillAsPaid: (studentId) => api.post(`/owner/billing/${studentId}/pay`),
  sendInvoiceNotification: (studentId, billDetails) => api.post(`/owner/billing/${studentId}/notify`, billDetails),
  getMenu: () => api.get('/owner/menu'),
  saveMenu: (menuData) => api.post('/owner/menu', menuData),
};

export default ownerApi;
