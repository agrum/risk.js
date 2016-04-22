var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res, next) {
  req.app.db.models.Link.findOne(
    {_id: req.params.id},
    function(err, link) {
      res.send(link);
    }
  );
});

router.post('/', function(req, res, next) {
  console.log(req.body);
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.map) {
      workflow.outcome.errfor.type = 'required';
    }
    if(!req.body.name)
    {
      workflow.outcome.errfor.name = 'required';
    }
    if(req.body.territories.length != 2)
    {
      workflow.outcome.errfor.territories = 'required';
    }

    var checkMapExists = function(callback) {
      req.app.db.models.Map.findOne({_id: req.body.map}, function(err, map){
        if (err) {
          return callback(err, null);
        }
        if (!map) {
          return callback(err, null);
        }

        return callback(null, 'done');
      });
    };

    var checkTerritoriesExist = function(callback) {
      req.app.db.models.Territory.find(
        {$or: [{_id: req.body.territories[0]}, {_id: req.body.territories[1]}]},
        function(err, territories){
          if (err) {
            return callback(err, null);
          }
          if (territories.length != 2) {
            return callback(err, null);
          }

          return callback(null, 'done');
        }
      );
    };

    var checkLinkDoesntExist = function(callback) {
      var nameSplit = req.body.name.split('-');
      req.app.db.models.Link.findOne(
        {$or: [{"name": nameSplit[0] + '-' + nameSplit[1]}, {"name": nameSplit[1] + '-' + nameSplit[0]}]},
        function(err, link){
          if (err) {
            return callback(err, null);
          }
          if (link) {
            return callback('link already exists', null);
          }

          return callback(null, 'done');
        }
      );
    };

    var checkMerge = function(err, results) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.emit('createLink');
    };

    require('async').parallel([checkMapExists, checkTerritoriesExist, checkLinkDoesntExist], checkMerge);
  });

  workflow.on('createLink', function() {
    req.app.db.models.Link.create(req.body, function(err, link){
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.emit('updateMapAndTerritories', link._id);
    });
  });

  workflow.on('updateMapAndTerritories', function(linkId) {
    var updateTerritoryA = function(callback) {
      req.app.db.models.Territory.findByIdAndUpdate(
        req.body.territories[0],
        {$push: { links: linkId }},
        function (err, resp){
          return callback(err, null);
        }
      );
    };

    var updateTerritoryB = function(callback) {
      req.app.db.models.Territory.findByIdAndUpdate(
        req.body.territories[1],
        {$push: { links: linkId }},
        function (err, resp){
          return callback(err, null);
        }
      );
    };

    var updateMap = function(callback) {
      req.app.db.models.Map.findByIdAndUpdate(
        req.body.map,
        {$push: { links: linkId }},
        function (err, resp){
          return callback(err, null);
        }
      );
    };

    var checkMerge = function(err, results) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.emit('response');
    };

    require('async').parallel([updateTerritoryA, updateTerritoryB, updateMap], checkMerge);
  });

  workflow.emit('validate');
});

module.exports = router;
