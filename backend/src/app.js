const express = require('express');
const cors = require('cors');

//this are the imports of the routes of the following module 
const authRoutes = require('./routes/auth.routes');
const messRoutes = require('./routes/mess.routes');
const attendanceRoutes = require('./routes/attendance.route');
const dashboardRoutes = require('./routes/dashboard.route');
const menuRoutes = require('./routes/menu.route');
const rechargeRoutes = require('./routes/recharge.route');
const leaveRoutes = require('./routes/leave.route');
const residentDashboardRoutes = require('./routes/residentDashboard.route');
const paymentRoutes = require('./routes/payment.route');
const attendanceHistoryRoutes = require('./routes/attendanceHistory.route');
const ratingRoutes = require('./routes/rating.route');
const profileRoutes = require('./routes/profile.route');
const activityRoutes = require('./routes/activity.route');
const notificationRoutes = require('./routes/notification.route');

const app = express();

//route mounting paths -> this let the express to use the routes of the following module 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes); // for auth routes
app.use('/api/mess', messRoutes); // for mess routes
app.use('/api/attendance', attendanceRoutes); // for attendance routes
app.use('/api/dashboard', dashboardRoutes); // for dashboard routes
app.use('/api/menu', menuRoutes); // for menu routes
app.use('/api/recharge', rechargeRoutes); // for recharge routes
app.use('/api/leave',leaveRoutes); // for leave routes
app.use('/api/resident-dashboard',residentDashboardRoutes); // for resident dashboard routes
app.use('/api/payment',paymentRoutes); // for payment routes
app.use('/api/attendance-history',attendanceHistoryRoutes); // for attendance history routes
app.use('/api/rating',ratingRoutes); // for rating routes
app.use('/api/profile',profileRoutes); // for profile routes
app.use('/api/activity',activityRoutes); // for activity routes
app.use('/api/notification',notificationRoutes); // for notification routes

app.get('/', (req,res) => {
    res.send("Jhevan Backend Running");
});

module.exports = app;