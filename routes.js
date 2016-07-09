'use strict';

function ensureAuthenticated(req, res, next) {
  req.session.returnUrl = req.originalUrl;
  console.log(req.session.returnUrl);
  if (req.isAuthenticated()) {
    return next();
  }
  res.set('X-Auth-Required', 'true');
  res.redirect('/login/');
}

exports = module.exports = function(app) {
  app.use('/', require('./routes/index'));
  app.use('/login', require('./routes/login'));
  app.use('/signup', require('./routes/signup'));

  app.all('/*', ensureAuthenticated);
  app.use('/users', require('./routes/users'));
  app.use('/game', require('./routes/game'));
  app.use('/map', require('./routes/map'));
  app.use('/territory', require('./routes/territory'));
  app.use('/link', require('./routes/link'));
  app.use('/logout', require('./routes/logout'));

  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
};
