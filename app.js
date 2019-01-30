require('dotenv').load();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport      = require("passport"),
      LocalStrategy = require("passport-local"),
      session       = require("express-session"),
      models        = require("./models"),
      bcryptjs      = require("bcryptjs");




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(session({secret : "acute zumba plant"}));
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'POST, PUT, PATCH');
    return res.status(200).json({});
  }
  next();
});

// must be BELOW any app.uses (including my CORS policy)
app.use('/', indexRouter);
app.use('/users', usersRouter);


passport.use('local', new LocalStrategy({
  usernameField : 'username',
  passwordField : 'password',
  passReqToCallback : true
}, (req, username, password, done) => {
  
  process.nextTick(() => {
    models.UserAccount.find({
      where : {
        username : username
      }
    }).then((userRecord, error) => {
      if (error) {
        console.log('=================== 1 error =====================');
        return done(error);
      }
      else if (userRecord === false) {
        console.log('============== 2 no userRecord found ================');
        return done(null, false);
      }
      bcryptjs.compare(req.body.password, userRecord.password, (error, compareResult) => {
        if (compareResult === false) {
          console.log('================= 3 pw mismatch ====================');
          return done(null, false);
        } else if (compareResult) {
          console.log('=============== 4 successful local strat ==============');
          return done(null, userRecord); // goes into req.user
        }
      })
    })
  })
}));

passport.serializeUser((user, done) => { done(null, user) });
passport.deserializeUser((user, done) => { done(null, user) });



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
