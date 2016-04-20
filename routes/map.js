var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res, next) {
  req.app.db.models.Map.findOne(
    {_id: req.params.id},
    function(err, territory) {
      res.send(territory);
    }
  );
});

module.exports = router;
