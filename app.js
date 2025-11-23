require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const connection = require('./connect');

const app = express();

// Middlewares
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to DB
connection();

// --------------------------------------
// ROUTES (USE ONLY ONE CLEAN VERSION)
// --------------------------------------

// Authentication & User
app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));

// CRM Modules
app.use('/accounts', require('./routes/accountRoutes'));
app.use('/branches', require('./routes/branchRoutes'));
app.use('/students', require('./routes/studentRoutes'));
app.use('/employees', require('./routes/employeeRoutes'));
app.use('/fees', require('./routes/feesRoutes'));
app.use('/courses', require('./routes/courseRoutes'));

// Projects & Tasks
app.use('/projects', require('./routes/projectRoutes'));
app.use('/tasks', require('./routes/taskRoutes'));

// Default routes
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/node')); // optional if used

// PORT (bin/www will handle server start)
const PORT = process.env.PORT || 8000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


module.exports = app;
