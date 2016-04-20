'use strict';

exports = module.exports = function(app, mongoose) {
  var territorySchema = new mongoose.Schema({
    _id: {
      type: String,
      default: require('../utils/helpers').generateGUID
    },
    name: String,
    path: String
  });
  app.db.model('Territory', territorySchema);
};
