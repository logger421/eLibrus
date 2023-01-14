var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

// Routers
var studentRouter = require('./routes/student');
var parentRouter = require('./routes/parent');
var teacherRouter = require('./routes/teacher');
var adminRouter = require('./routes/admin');
var loginRouter = require('./routes/login');
var { isStudent, isParent, isTeacher, isAdmin, redirectWithRole } = require('./helpers/redirect_role');
var passport = require('passport');
require('./helpers/passportLocal')(passport);
var app = express();

app.use(session({
  secret:'secret',
  resave: false,
  saveUninitialized: false,
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Init passport
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/home', loginRouter);
app.use('/student', isStudent, studentRouter);
app.use('/parent', isParent, parentRouter);
app.use('/teacher', isTeacher, teacherRouter);
app.use('/', redirectWithRole);
// app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
