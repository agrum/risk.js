var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res, next) {
  req.app.db.models.Territory.findOne(
    {_id: req.params.id},
    function(err, territory) {
      res.send(territory);
    }
  );
});

router.post('/', function(req, res, next) {
  req.app.db.models.Territory.create(
    req.body,
    function(err, territory) {
      res.send('');
    }
  );
});

module.exports = router;
