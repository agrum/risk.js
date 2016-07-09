'use strict';

exports = module.exports = function(app, mongoose) {
  var deepPopulate = require('mongoose-deep-populate')(mongoose);

  var schema = new mongoose.Schema({
    _id: {
      type: String,
      default: require('../utils/helpers').generateGUID
    },
    name: String,
    creationTIme: {
      type: Date,
      default: new Date() },
    map: {
      type: String,
      ref: 'Map'
    },
    players: [{
      type: String,
      ref: 'User'
    }]
  });
  schema.plugin(deepPopulate, {});
  app.db.model('Game', schema);
};
