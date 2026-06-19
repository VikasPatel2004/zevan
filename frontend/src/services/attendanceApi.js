import api from './api';

export const attendanceApi = {
  markAttendance: (data) => api.post('/attendance/mark', data),
  getAttendanceHistory: () => api.get('/attendance-history/my-attendance'),
  
  // For owners to get today's attendance for their mess
  getTodayAttendance: () => api.get('/attendance/today'),
  bulkMarkAttendance: (attendances) => api.post('/attendance/bulk-mark', { attendances }),
};

export default attendanceApi;
