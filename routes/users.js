var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users', {title: 'Users'});
});

router.get('/:userId', function(req, res, next) {
  res.send('This is user ' + req.params.userId + '\'s personal page.');
});


module.exports = router;
