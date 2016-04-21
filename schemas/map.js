'use strict';

exports = module.exports = function(app, mongoose) {
  var mapSchema = new mongoose.Schema({
    _id: {
      type: String,
      default: require('../utils/helpers').generateGUID
    },
    name: String,
    territories: [{
      type: String,
      ref: 'Territory'
    }]
  });
  app.db.model('Map', mapSchema);
};
