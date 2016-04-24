'use strict';

exports = module.exports = function(app) {
  app.use('/', require('./routes/index'));
  app.use('/users', require('./routes/users'));
  app.use('/map', require('./routes/map'));
  app.use('/territory', require('./routes/territory'));
  app.use('/link', require('./routes/link'));

  app.post('/login', app.passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login'}));
  app.use('/login', require('./routes/login'));

  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
};
