var express = require('express');
var app = express();
var logger = require('morgan');
var flash = require('connect-flash');
var multiparty = require('connect-multiparty');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var path = require('path');
var favicon = require('serve-favicon');

var config = require('./config.json');
var routes = require('./routes/index');
var db = require('./lib/db');

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
app.locals = require('./helpers/index');
var users = require('./routes/users');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride(function(req, res){
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
		// look in url - encoded POST bodies and delete it
		var method = req.body._method;
		delete req.body._method;
		return method;
	}
}));

app.use(cookieParser());
app.use(cookieSession({
	secret: config.sessionSecret,
	cookie: {
		maxAge: config.sessionMaxAge
	}
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

if (app.get('env') === 'development') {
	app.use(errorHandler());
}

//app.use('/', routes);
//app.use('/users', users);

//Declaring application routes
app.get('/', routes.main.requireUserAuth, routes.files.index);
app.get('/files/:file', routes.main.requireUserAuth, routes.files.show);
app.del('/files/:file', routes.main.requireUserAuth, routes.files.destroy);
app.post('/files', multiparty(), routes.main.requireUserAuth, routes.files.create);
app.get('/users/new', routes.users.new);
app.post('/users', routes.users.create);
app.get('/sessions/new', routes.sessions.new);
app.post('/sessions', routes.sessions.create);
app.del('/sessions', routes.sessions.destroy);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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

db.connect();
//app.listen(config.port);

module.exports = app;
