
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('post', {title: 'posts'});
});

router.get('/:postId', function(req, res, next) {
  res.send('This is ' + req.params.postId + '\'s  page.');
});

router.get('/:postId/related', function(req, res, next) {
  res.render('related', {title: 'related'});
});

module.exports = router;
=======
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('post', {title: 'posts'});
});

router.get('/:postId', function(req, res, next) {
  res.send('This is ' + req.params.postId + '\'s  page.');
});

router.get('/:postId/related', function(req, res, next) {
  res.render('related', {title: 'related'});
});

module.exports = router;

