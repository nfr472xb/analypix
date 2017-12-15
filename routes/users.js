var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:userId', function(req, res, next) {
  res.send('This is user ' + req.params.userId + '\'s personal page.');
});

router.get('/:userId/:postId', function(req, res , next){
  res.send('This is user <b>' + req.params.userId + '</b>\'s post page, postId is <b>' + req.params.postId + '</b>');
});

module.exports = router;
