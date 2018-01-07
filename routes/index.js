var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});
router.get('/login', function(req, res) {
  res.render('login');
})
router.get('/register', function(req, res) {
  res.render('register');
})
router.get('/upload', function(req, res) {
  res.render('upload');
})
router.get('/posts/:postId', function(req, res) {
  res.render('');
})
router.get('/posts/:postId/related', function(req, res) {
  res.render('');
})
module.exports = router;
