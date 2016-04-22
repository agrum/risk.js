'use strict';

exports = module.exports = function(app, mongoose) {
  var linkSchema = new mongoose.Schema({
    _id: {
      type: String,
      default: require('../utils/helpers').generateGUID
    },
    name: String,
    map: {
      type: String,
      ref: 'Territory'
    },
    territories: [{
      type: String,
      ref: 'Territory'
    }]
  });
  app.db.model('Link', linkSchema);
};
