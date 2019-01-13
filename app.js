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
var Post = require('./model/post');
var mongoose = require('mongoose');

/*var db = monk('mongodb://root:root123@ds251240.mlab.com:51240/nodehome')
;*/


/*var monk = require('monk');
var db = monk('mongodb://root:root123@ds251240.mlab.com:51240/nodehome');
*/
mongoose.connect('mongodb://root:root123@ds251240.mlab.com:51240/nodehome',
{ useNewUrlParser: true }, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("connected to DB");
    }
})


var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');

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
/*app.use(function(req, res, next){
		req.db = db;
		next();
})*/;

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
	saveUnitialized: false,
	secret: 'secret'
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(__dirname + '/public'));
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.get('/add', function(req, res, next) {
  res.render('addpost', { title: 'Express' });
});

app.post('/posts/add',upload.single('mainimage'),  function(req, res){
	var title = req.body.title;
  var body = req.body.body;
  var author = req.body.author;
  var category = req.body.category;
  var date = new Date();

  //check if file is uploaded
  if(req.file){
    var mainimage = req.file.mainimage
  } else{
    var mainimage = 'noimage.jpg'
  }

  // Form Validation
  req.checkBody('title','Title field is required').notEmpty();
  req.checkBody('body', 'Body field is required').notEmpty();

  // Check Errors
  var errors = req.validationErrors();
  if(error){
    res.render('addpost', {
      "error": error
    })
  }else{
    var posts = db.get('posts');
      post.insert({
        "title": title,
        "body": body,
        "author": author,
        "category": category,
        "date": date,
        "mainimage": mainimage
      }, function(err, post){
        if(err){
          res.send(err)
        }else{
        req.flash('success','Post Added');
        res.location('/');
        res.redirect('/');
        }
      })



  }
})

/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});*/

app.use(function(req, res, next) {
  return res.status(404).send({ message: 'Route'+req.url+' Not found.' });
});
// error handler
/*app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
