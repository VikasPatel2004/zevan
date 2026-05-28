const express = require('express');
const cors = require('cors');

//this are the imports of the routes of the following module 
const authRoutes = require('./routes/auth.routes');
const messRoutes = require('./routes/mess.routes');
const attendanceRoutes = require('./routes/attendance.route');
const dashboardRoutes = require('./routes/dashboard.route');
const menuRoutes = require('./routes/menu.route');

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

app.get('/', (req,res) => {
    res.send("Jhevan Backend Running");
});

module.exports = app;