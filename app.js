require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var registerRouter = require('./routes/register');
var projectRouter = require('./routes/project');
var taskRouter = require('./routes/task');
var nodeRouter = require('./routes/node');

const connection = require('./connect');

var app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

connection();

console.log('PORT:', process.env.PORT);

app.listen(() => {
    console.log(`Server is running on port ${process.env.PORT}`);
})

app.use('/', indexRouter);
app.use('/auth', registerRouter);
app.use('/project', projectRouter);
app.use('/task', taskRouter);
app.use('/node', nodeRouter);

module.exports = app;
