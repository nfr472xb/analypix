var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Analypix'
});


});
router.get('/login', function(req, res) {
  res.render('Login', {
    title: 'Login'
});
})
router.get('/analysis', function(req, res) {
  res.render('Aegister', {
    title: 'Aegister'
});
})
router.get('/register', function(req, res) {
  res.render('Register', {
    title: 'Register'
});
})
router.get('/upload', function(req, res) {
  res.render('Upload', {
    title: 'Upload'
});
})
router.get('/post/:postId', function(req, res) {
  res.render('post', {
    title: 'Post'
});

})
router.get('/location/:locationName', function(req, res) {
  res.render('Location', {
    title: 'Location'
});
})
router.get('/tag/:tagName', function(req, res) {
  res.render('Tag', {
    title: 'Tag'
});
})

module.exports = router;
