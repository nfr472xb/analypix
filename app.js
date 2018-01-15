var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.get('/users/:userId', function(req, res) {
    res.render('users', {
        title: 'Users'
    });


  });

  


app.get('/', function (req, res) {

    res.render('index', {
        title: 'Analypix'
    });

  });

app.get('/post/:postId', function(req, res) {
    res.render('post', {
      title: 'Post'
  });
  })

app.get('/upload', function(req, res) {
    res.render('Upload', {
      title: 'Upload'
  });
  })


  app.get('/login', function(req, res) {

    
    res.render('Login', {
      title: 'Login'
  });
  })
  app.get('/analysis', function(req, res) {
    res.render('Aegister', {
      title: 'Aegister'
  });
  })
  app.get('/register', function(req, res) {
    res.render('Register', {
      title: 'Register'
  });
  })
  app.get('/upload', function(req, res) {
    res.render('Upload', {
      title: 'Upload'
  });
  })
  
  app.get('/location/:locationName', function(req, res) {
    res.render('Location', {
      title: 'Location'
  });
  })
  app.get('/tag/:tagName', function(req, res) {
    res.render('Tag', {
      title: 'Tag'
  });
  })
  


  

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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
