var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res, next) {
  req.app.db.models.Map.findOne({_id: req.params.id})
  .deepPopulate(['territories', 'links'])
  .exec(function(err, map) {
    res.send(map);
  });
});

module.exports = router;
