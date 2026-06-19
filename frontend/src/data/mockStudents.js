import { MONTHS } from './mockMenus';

export const CURRENT_STUDENT = {
  name: 'Rahul',
  fullName: 'Rahul Sharma',
  messId: 1, 
  messName: 'Sharma Ji Ka Dhaba',
  ownerName: 'Ramesh Sharma',
  ownerPhone: '+91 98765 43210',
  messAddress: '42, Rajwada Road, Near Holkar Stadium, Indore',
  mealPlan: 'Both',
  monthlyRate: 2800,
};

export const OWNER_STUDENTS = [
  { id: 1, name: 'Rahul Sharma', phone: '+91 98765 43210', plan: 'Both', rate: 2800, joinDate: '2026-01-15', status: 'Active' },
  { id: 2, name: 'Priya Joshi', phone: '+91 87654 32109', plan: 'Both', rate: 2800, joinDate: '2026-02-01', status: 'Active' },
  { id: 3, name: 'Amit Singh', phone: '+91 76543 21098', plan: 'Lunch', rate: 1500, joinDate: '2025-11-10', status: 'Active' },
  { id: 4, name: 'Sneha Rao', phone: '+91 65432 10987', plan: 'Both', rate: 2800, joinDate: '2026-03-05', status: 'Active' },
  { id: 5, name: 'Vikram Patel', phone: '+91 54321 09876', plan: 'Dinner', rate: 1500, joinDate: '2026-01-20', status: 'Active' },
  { id: 6, name: 'Deepa Nair', phone: '+91 43210 98765', plan: 'Both', rate: 2800, joinDate: '2026-04-01', status: 'Active' },
  { id: 7, name: 'Rohan Gupta', phone: '+91 32109 87654', plan: 'Both', rate: 2800, joinDate: '2025-09-15', status: 'Active' },
  { id: 8, name: 'Kavya Iyer', phone: '+91 21098 76543', plan: 'Lunch', rate: 1500, joinDate: '2026-02-20', status: 'Active' },
  { id: 9, name: 'Siddharth Jain', phone: '+91 10987 65432', plan: 'Both', rate: 2800, joinDate: '2026-01-05', status: 'Paused' },
  { id: 10, name: 'Ananya Mishra', phone: '+91 99887 76655', plan: 'Both', rate: 2800, joinDate: '2026-03-15', status: 'Active' },
  { id: 11, name: 'Karan Mehta', phone: '+91 88776 65544', plan: 'Both', rate: 2800, joinDate: '2026-04-10', status: 'Active' },
  { id: 12, name: 'Isha Reddy', phone: '+91 77665 54433', plan: 'Dinner', rate: 1500, joinDate: '2026-02-28', status: 'Active' },
  { id: 13, name: 'Arjun Kapoor', phone: '+91 66554 43322', plan: 'Both', rate: 2800, joinDate: '2025-12-01', status: 'Active' },
  { id: 14, name: 'Neha Agarwal', phone: '+91 55443 32211', plan: 'Lunch', rate: 1500, joinDate: '2026-01-25', status: 'Active' },
  { id: 15, name: 'Manish Tiwari', phone: '+91 44332 21100', plan: 'Both', rate: 2800, joinDate: '2026-05-01', status: 'Active' },
  { id: 16, name: 'Pooja Deshmukh', phone: '+91 33221 10099', plan: 'Both', rate: 2800, joinDate: '2025-10-15', status: 'Active' },
  { id: 17, name: 'Ravi Kumar', phone: '+91 22110 09988', plan: 'Both', rate: 2800, joinDate: '2026-03-20', status: 'Active' },
  { id: 18, name: 'Shruti Pandey', phone: '+91 11009 98877', plan: 'Dinner', rate: 1500, joinDate: '2026-04-05', status: 'Active' },
  { id: 19, name: 'Varun Saxena', phone: '+91 99001 12233', plan: 'Both', rate: 2800, joinDate: '2026-02-10', status: 'Active' },
  { id: 20, name: 'Divya Chauhan', phone: '+91 88990 01122', plan: 'Both', rate: 2800, joinDate: '2026-01-08', status: 'Active' },
  { id: 21, name: 'Nikhil Verma', phone: '+91 77889 90011', plan: 'Both', rate: 2800, joinDate: '2026-05-05', status: 'Active' },
  { id: 22, name: 'Tanvi Shah', phone: '+91 66778 89900', plan: 'Lunch', rate: 1500, joinDate: '2026-03-01', status: 'Paused' },
  { id: 23, name: 'Harsh Yadav', phone: '+91 55667 78899', plan: 'Both', rate: 2800, joinDate: '2026-04-15', status: 'Active' },
  { id: 24, name: 'Simran Kaur', phone: '+91 44556 67788', plan: 'Both', rate: 2800, joinDate: '2025-08-20', status: 'Active' },
  { id: 25, name: 'Aditya Bhatt', phone: '+91 33445 56677', plan: 'Both', rate: 2800, joinDate: '2026-02-14', status: 'Active' },
];

export const OWNER_MESS = {
  name: 'Sharma Ji Ka Dhaba',
  ownerName: 'Ramesh Sharma',
  totalStudents: 25,
  activeStudents: 23,
};

export const generateAttendance = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const currentDay = today.getDate();
  const attendance = {};

  for (let d = 1; d <= daysInMonth; d++) {
    if (d <= currentDay) {
      const rand = Math.random();
      attendance[d] = {
        lunch: rand > 0.15 ? 'ate' : 'skipped',
        dinner: rand > 0.2 ? 'ate' : 'skipped',
      };
    } else {
      attendance[d] = { lunch: 'unmarked', dinner: 'unmarked' };
    }
  }
  // Make today unmarked so student can interact
  attendance[currentDay] = { lunch: 'unmarked', dinner: 'unmarked' };
  return attendance;
};

export const generateOwnerBilling = (month, year) => {
  return OWNER_STUDENTS.filter(s => s.status === 'Active').map(student => {
    const totalMeals = student.plan === 'Both' ? 60 : 30;
    const attended = Math.floor(totalMeals * (0.7 + Math.random() * 0.25));
    const amount = Math.round((attended / totalMeals) * student.rate);
    const isPaid = Math.random() > 0.4;
    return {
      ...student,
      totalMeals,
      attended,
      amount,
      status: isPaid ? 'Paid' : 'Pending',
    };
  });
};
