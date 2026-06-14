// ========== ZEVAN — PLACEHOLDER DATA ==========

export const CITIES = ['Indore', 'Bhopal', 'Nagpur', 'Pune', 'Lucknow'];

export const MEALS = [
  'Dal Tadka', 'Roti', 'Chawal', 'Sabzi', 'Paneer Butter Masala',
  'Chole', 'Rajma', 'Aloo Gobi', 'Dal Makhani', 'Kadhi Chawal',
  'Bhindi Fry', 'Jeera Rice', 'Raita', 'Papad', 'Mix Veg',
  'Palak Paneer', 'Methi Thepla', 'Poori', 'Matar Paneer', 'Baingan Bharta'
];

export const MESS_LIST = [
  {
    id: 1,
    name: 'Sharma Ji Ka Dhaba',
    distance: '0.3 km',
    cuisine: 'Veg',
    price: 2800,
    rating: 4.3,
    hygiene: 'A',
    todayMenu: 'Dal Tadka, Roti, Chawal, Sabzi',
    city: 'Indore',
    address: '42, Rajwada Road, Near Holkar Stadium, Indore',
    ownerName: 'Ramesh Sharma',
    phone: '+91 98765 43210',
    description: 'Pure vegetarian mess with home-style Indori food. Serving students since 2015.',
    weeklyMenu: {
      Mon: { lunch: 'Dal Tadka, Roti, Chawal, Aloo Gobi', dinner: 'Rajma, Roti, Jeera Rice, Raita' },
      Tue: { lunch: 'Chole, Roti, Chawal, Bhindi Fry', dinner: 'Paneer Butter Masala, Roti, Chawal, Papad' },
      Wed: { lunch: 'Kadhi Chawal, Roti, Mix Veg', dinner: 'Dal Makhani, Roti, Chawal, Sabzi' },
      Thu: { lunch: 'Rajma, Roti, Chawal, Sabzi', dinner: 'Palak Paneer, Roti, Jeera Rice' },
      Fri: { lunch: 'Paneer Butter Masala, Roti, Chawal', dinner: 'Chole, Poori, Chawal, Raita' },
      Sat: { lunch: 'Aloo Gobi, Roti, Dal Tadka, Chawal', dinner: 'Matar Paneer, Roti, Chawal' },
      Sun: { lunch: 'Special Thali — Poori, Chole, Chawal, Kheer', dinner: 'Dal Fry, Roti, Chawal, Sabzi' },
    },
    reviews: [
      { name: 'Amit Singh', rating: 5, text: 'Ekdum ghar jaisa khana! Dal tadka toh maa ke haath jaisa lagta hai.', date: '2 weeks ago' },
      { name: 'Sneha Rao', rating: 4, text: 'Consistent quality. Kabhi complaint nahi hui. Thoda variety aur badha sakte hain.', date: '1 month ago' },
      { name: 'Vikram Patel', rating: 4, text: 'Value for money best hai. Owner bhi bahut achhe insaan hain.', date: '3 weeks ago' },
    ]
  },
  {
    id: 2,
    name: 'Annapurna Tiffin',
    distance: '0.7 km',
    cuisine: 'Veg',
    price: 3000,
    rating: 4.5,
    hygiene: 'A+',
    todayMenu: 'Paneer Butter Masala, Roti, Chawal, Raita',
    city: 'Indore',
    address: '15, Vijay Nagar, Indore',
    ownerName: 'Sunita Devi',
    phone: '+91 87654 32109',
    description: 'Premium tiffin service run by Sunita aunty. Fresh ingredients, zero compromise on taste.',
    weeklyMenu: {
      Mon: { lunch: 'Paneer Butter Masala, Roti, Chawal', dinner: 'Dal Tadka, Roti, Jeera Rice, Salad' },
      Tue: { lunch: 'Chole, Poori, Chawal, Papad', dinner: 'Mix Veg, Roti, Dal Fry, Chawal' },
      Wed: { lunch: 'Matar Paneer, Roti, Chawal', dinner: 'Kadhi Chawal, Roti, Bhindi Fry' },
      Thu: { lunch: 'Rajma, Roti, Chawal, Raita', dinner: 'Palak Paneer, Roti, Chawal' },
      Fri: { lunch: 'Dal Makhani, Roti, Jeera Rice', dinner: 'Aloo Gobi, Roti, Chawal, Papad' },
      Sat: { lunch: 'Baingan Bharta, Roti, Dal, Chawal', dinner: 'Paneer Tikka Masala, Roti, Chawal' },
      Sun: { lunch: 'Special — Pav Bhaji, Pulao, Kheer', dinner: 'Light Dinner — Khichdi, Papad, Achaar' },
    },
    reviews: [
      { name: 'Priya Joshi', rating: 5, text: 'Sunita aunty ka khana ekdum maa ke haath jaisa. Best tiffin in Indore!', date: '1 week ago' },
      { name: 'Deepa Nair', rating: 5, text: 'Hygienic, tasty, and on time. Kya chahiye aur?', date: '2 weeks ago' },
    ]
  },
  {
    id: 3,
    name: 'Ghar Ka Swad',
    distance: '1.2 km',
    cuisine: 'Both',
    price: 3500,
    rating: 4.1,
    hygiene: 'B+',
    todayMenu: 'Chicken Curry, Roti, Chawal, Salad',
    city: 'Bhopal',
    address: '78, MP Nagar, Zone 2, Bhopal',
    ownerName: 'Farid Khan',
    phone: '+91 76543 21098',
    description: 'Veg and non-veg both available. Bhopali flavors with a homely touch.',
    weeklyMenu: {
      Mon: { lunch: 'Dal Tadka, Roti, Chawal, Sabzi', dinner: 'Chicken Curry, Roti, Chawal' },
      Tue: { lunch: 'Rajma, Roti, Chawal, Raita', dinner: 'Egg Curry, Roti, Chawal' },
      Wed: { lunch: 'Paneer Do Pyaza, Roti, Chawal', dinner: 'Keema Matar, Roti, Chawal' },
      Thu: { lunch: 'Chole, Roti, Chawal, Papad', dinner: 'Fish Fry, Dal, Roti, Chawal' },
      Fri: { lunch: 'Kadhi Chawal, Roti, Bhindi Fry', dinner: 'Mutton Curry, Roti, Chawal' },
      Sat: { lunch: 'Mix Veg, Roti, Dal, Chawal', dinner: 'Chicken Biryani, Raita' },
      Sun: { lunch: 'Special Thali — Biryani, Raita, Gulab Jamun', dinner: 'Light — Khichdi, Papad' },
    },
    reviews: [
      { name: 'Rahul Sharma', rating: 4, text: 'Non-veg quality kaafi achhi hai. Chicken curry is legit.', date: '1 week ago' },
      { name: 'Amit Singh', rating: 4, text: 'Both options milte hain toh convenient hai. Taste bhi theek hai.', date: '3 weeks ago' },
    ]
  },
  {
    id: 4,
    name: 'Malhotra Mess',
    distance: '0.5 km',
    cuisine: 'Veg',
    price: 2500,
    rating: 3.9,
    hygiene: 'B',
    todayMenu: 'Chole, Roti, Chawal, Papad',
    city: 'Nagpur',
    address: '23, Dharampeth, Nagpur',
    ownerName: 'Ajay Malhotra',
    phone: '+91 65432 10987',
    description: 'Budget-friendly mess for students. Simple, filling meals at the lowest prices.',
    weeklyMenu: {
      Mon: { lunch: 'Dal Fry, Roti, Chawal, Sabzi', dinner: 'Aloo Gobi, Roti, Chawal' },
      Tue: { lunch: 'Chole, Roti, Chawal, Papad', dinner: 'Dal Tadka, Roti, Chawal' },
      Wed: { lunch: 'Rajma, Roti, Chawal', dinner: 'Mix Veg, Roti, Chawal' },
      Thu: { lunch: 'Kadhi Chawal, Roti', dinner: 'Sabzi, Roti, Dal, Chawal' },
      Fri: { lunch: 'Aloo Matar, Roti, Chawal', dinner: 'Chole, Roti, Chawal' },
      Sat: { lunch: 'Dal Makhani, Roti, Chawal', dinner: 'Sabzi, Roti, Chawal' },
      Sun: { lunch: 'Poori, Chole, Chawal', dinner: 'Khichdi, Papad, Achaar' },
    },
    reviews: [
      { name: 'Vikram Patel', rating: 4, text: 'Budget mein best hai. Fancy nahi hai but pet bharr ke khana milta hai.', date: '2 weeks ago' },
    ]
  },
  {
    id: 5,
    name: 'Shree Krishna Tiffin',
    distance: '1.5 km',
    cuisine: 'Veg',
    price: 3200,
    rating: 4.6,
    hygiene: 'A+',
    todayMenu: 'Dal Makhani, Jeera Rice, Roti, Paneer',
    city: 'Pune',
    address: '56, Kothrud, Near MIT College, Pune',
    ownerName: 'Meena Krishnan',
    phone: '+91 54321 09876',
    description: 'South-meets-North Indian tiffin. Clean kitchen, transparent billing, loved by MIT students.',
    weeklyMenu: {
      Mon: { lunch: 'Sambar Rice, Roti, Sabzi', dinner: 'Dal Makhani, Roti, Jeera Rice' },
      Tue: { lunch: 'Paneer Butter Masala, Roti, Chawal', dinner: 'Rasam, Rice, Papad, Sabzi' },
      Wed: { lunch: 'Chole, Roti, Chawal, Raita', dinner: 'Bisi Bele Bath, Papad, Salad' },
      Thu: { lunch: 'Rajma, Roti, Chawal', dinner: 'Palak Paneer, Roti, Chawal' },
      Fri: { lunch: 'Kadhi Chawal, Roti, Bhindi', dinner: 'Veg Pulao, Raita, Papad' },
      Sat: { lunch: 'Aloo Gobi, Roti, Dal, Chawal', dinner: 'Dosa, Chutney, Sambar' },
      Sun: { lunch: 'Special — Thali with Gulab Jamun', dinner: 'Light — Upma, Chutney' },
    },
    reviews: [
      { name: 'Sneha Rao', rating: 5, text: 'Best tiffin near MIT! Clean, tasty, and Meena aunty is so sweet.', date: '5 days ago' },
      { name: 'Deepa Nair', rating: 5, text: 'South Indian options bhi milte hain — perfect for me!', date: '2 weeks ago' },
      { name: 'Priya Joshi', rating: 4, text: 'Thoda door hai but worth the distance. Quality top notch.', date: '1 month ago' },
    ]
  },
  {
    id: 6,
    name: 'Desi Bites',
    distance: '0.8 km',
    cuisine: 'Non-Veg',
    price: 3800,
    rating: 4.4,
    hygiene: 'A',
    todayMenu: 'Butter Chicken, Naan, Chawal, Salad',
    city: 'Lucknow',
    address: '12, Hazratganj, Lucknow',
    ownerName: 'Nawab Ali',
    phone: '+91 43210 98765',
    description: 'Lucknowi non-veg at mess prices. Biryani Fridays are legendary among students.',
    weeklyMenu: {
      Mon: { lunch: 'Chicken Curry, Roti, Chawal', dinner: 'Keema, Naan, Chawal' },
      Tue: { lunch: 'Egg Curry, Roti, Chawal, Salad', dinner: 'Fish Curry, Roti, Chawal' },
      Wed: { lunch: 'Butter Chicken, Naan, Chawal', dinner: 'Mutton Do Pyaza, Roti, Chawal' },
      Thu: { lunch: 'Chicken Korma, Roti, Chawal', dinner: 'Egg Bhurji, Roti, Chawal' },
      Fri: { lunch: 'Special Lucknowi Biryani, Raita', dinner: 'Chicken Tikka, Roti, Chawal' },
      Sat: { lunch: 'Keema Matar, Roti, Chawal', dinner: 'Fish Fry, Dal, Roti, Chawal' },
      Sun: { lunch: 'Mutton Biryani, Raita, Gulab Jamun', dinner: 'Light — Soup, Bread, Omelette' },
    },
    reviews: [
      { name: 'Rahul Sharma', rating: 5, text: 'Friday biryani ke liye toh log queue mein lagte hain! Absolutely amazing.', date: '3 days ago' },
      { name: 'Amit Singh', rating: 4, text: 'Lucknowi taste authentic hai. Thoda expensive but quality justifies it.', date: '1 week ago' },
    ]
  },
];

// Current student data (logged in as Rahul Sharma)
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

// Student attendance for current month (May 2026)
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

// Owner dashboard students list
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

// Owner billing data
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

// Owner mess info
export const OWNER_MESS = {
  name: 'Sharma Ji Ka Dhaba',
  ownerName: 'Ramesh Sharma',
  totalStudents: 25,
  activeStudents: 23,
};

// Owner's editable weekly menu (same as mess #1 but mutable)
export const DEFAULT_OWNER_MENU = {
  Mon: { lunch: 'Dal Tadka, Roti, Chawal, Aloo Gobi', dinner: 'Rajma, Roti, Jeera Rice, Raita' },
  Tue: { lunch: 'Chole, Roti, Chawal, Bhindi Fry', dinner: 'Paneer Butter Masala, Roti, Chawal, Papad' },
  Wed: { lunch: 'Kadhi Chawal, Roti, Mix Veg', dinner: 'Dal Makhani, Roti, Chawal, Sabzi' },
  Thu: { lunch: 'Rajma, Roti, Chawal, Sabzi', dinner: 'Palak Paneer, Roti, Jeera Rice' },
  Fri: { lunch: 'Paneer Butter Masala, Roti, Chawal', dinner: 'Chole, Poori, Chawal, Raita' },
  Sat: { lunch: 'Aloo Gobi, Roti, Dal Tadka, Chawal', dinner: 'Matar Paneer, Roti, Chawal' },
  Sun: { lunch: 'Special Thali — Poori, Chole, Chawal, Kheer', dinner: 'Dal Fry, Roti, Chawal, Sabzi' },
};

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
