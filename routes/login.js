var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  console.log('1');
  req.app.passport.authenticate(
    'local',
    {
      successRedirect: '/',
      failureRedirect: '/login'
    }
  );
});

module.exports = router;
