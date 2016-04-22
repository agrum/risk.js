'use strict';

exports = module.exports = function(app, mongoose) {
  var deepPopulate = require('mongoose-deep-populate')(mongoose);

  var mapSchema = new mongoose.Schema({
    _id: {
      type: String,
      default: require('../utils/helpers').generateGUID
    },
    name: String,
    territories: [{
      type: String,
      ref: 'Territory'
    }],
    links: [{
      type: String,
      ref: 'Link'
    }]
  });
  mapSchema.plugin(deepPopulate, {});
  app.db.model('Map', mapSchema);
};
