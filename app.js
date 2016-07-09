var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();
var bcrypt = require('bcrypt');

//passport
app.passport = passport;

//config
app.config = require('./config');

// database connection
app.db = mongoose.createConnection('mongodb://localhost/riskjs');
app.db.on('error', console.error.bind(console, 'connection error:'));
app.db.once('open', function() {});

//config data models
require('./models')(app, mongoose);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: app.config.cryptoKeySession,
  store: new mongoStore({ url: app.config.mongodb.uri })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

app.utility = {};
app.utility.workflow = require('./utils/workflow');

//setup passport
require('./passport')(app);

//setup routes
require('./routes')(app);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
