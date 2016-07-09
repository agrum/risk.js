var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    var workflow = req.app.utility.workflow(req, res);

    workflow.on('getMapArray', function() {
      req.app.db.models.Map.find({}, function(err, mapArray) {
        if (err) {
          return workflow.emit('exception', err);
        }

        workflow.mapArray = mapArray;

        workflow.emit('render');
      });
    });

    workflow.on('getGameArray', function() {
      req.app.db.models.Game.find({}, function(err, mapArray) {
        if (err) {
          return workflow.emit('exception', err);
        }

        workflow.mapArray = mapArray;

        workflow.emit('render');
      });
    });

    workflow.on('render', function() {
      res.render('index', { username: req.user.username, mapArray: JSON.stringify(workflow.mapArray)});
    });

    workflow.emit('getMapArray');
  }
  else {
    res.render('login', { title: 'Express'});
  }
});

module.exports = router;
