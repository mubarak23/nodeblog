var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser =  require("body-parser");
var session = require("express-session");
var moment = require("moment");
//var flash = require("flash");
//var monk = require(monk);
var multer = require("multer");
var upload = multer({ dest: 'uploads/' });
var expressValidator = require("express-validator");
var mongdb = require("mongodb");


/*var db = monk('mongodb://root:root123@ds251240.mlab.com:51240/nodehome')
;*/


var monk = require('monk');
var db = monk('mongodb://root:root123@ds251240.mlab.com:51240/nodehome');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//db middleware
app.use(function(req, res, next){
		req.db = db;
		next();
});

//connect flash middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


//express validator middleware
app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.'),
		root = namespace.shift(),
		forParam = root;

		while(namespace.length){
			forParam += '[' + namespace.shift() + ']';
		}
		return {
			param: forParam,
			msg: msg,
			value: value
		};
	}
}));


//sssion middleware
app.use(session({
	resave: true,
	saveUnitialized: true,
	secret: 'secret'
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
