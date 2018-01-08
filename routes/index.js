var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});
router.get('/login', function(req, res) {
  res.render('login');
})
router.get('/analysis', function(req, res) {
  res.render('analysis');
})
router.get('/register', function(req, res) {
  res.render('register');
})
router.get('/upload', function(req, res) {
  res.render('upload');
})
router.get('/posts/:postId', function(req, res) {
  res.render('posts', {postId: req.params});
})
router.get('/location/:locationName', function(req, res) {
  res.render('location', {location: req.params});
})
router.get('/tags/:tagName', function(req, res) {
  res.render('tags', {tagName: req.params});
})

module.exports = router;
