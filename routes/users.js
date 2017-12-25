var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('login', { title: 'Express' });
});

router.get('/:userId', function(req, res, next) {
  res.send('This is user ' + req.params.userId + '\'s personal page.');
});

module.exports = router;