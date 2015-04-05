var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//mongoose setup
var mongoose = require('mongoose');
mongoose.connect('mongodb://lunchmatch:coverboys42@dbh13.mongolab.com:27137/lunchmatch');
// var mongo = require('mongodb').MongoClient;
/*var uri = 'mongodb://lunchmatch:coverboys42@dbh13.mongolab.com:27137/lunchmatch';
mongo.connect(uri, function(err, db){
    if(err) {
        console.log('Error: unable to connect to the database');
        return;
    }
})*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'secret' }));
app.use(methodOverride());
app.use(require('stylus').middleware({ src: __dirname + 'public' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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
