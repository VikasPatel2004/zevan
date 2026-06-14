import api from './api';

export const studentApi = {
  getProfile: () => api.get('/student/profile'),
  getAttendance: () => api.get('/student/attendance'),
  markAttendance: (date, meal, status) => api.post('/student/attendance', { date, meal, status }),
  getBills: () => api.get('/student/bills'),
};

export default studentApi;
