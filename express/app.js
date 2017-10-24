var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RDBStore = require('express-session-rethinkdb')(session);
var passport = require('passport');
var flash = require('connect-flash');

var index = require('./routes/index');
var users = require('./routes/users');


var app = express();


require('./config/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cookieParser());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var rdbStore = new RDBStore({
  connectOptions: {
    servers: [
      { host: 'localhost', port: 28015 }
    ],
    db: 'signup',
    discovery: false,
    pool: true,
    buffer: 50,
    max: 1000,
    timeout: 20,
    timeoutError: 1000
  },
  table: 'session',
  sessionTimeout: 86400000,
  flushInterval: 60000,
  debug: false
});

app.use(session({
  key: 'sid',
  secret: 'my5uperSEC537(key)!',
  cookie: { maxAge: 860000 },
  store: rdbStore
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(flash());

app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  next();
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.login = req.isAuthenticated();
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
