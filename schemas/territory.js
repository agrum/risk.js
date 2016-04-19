'use strict';

exports = module.exports = function(app, mongoose) {
  var territorySchema = new mongoose.Schema({
    _id: {
      type: String,
      default: require('../utils/helpers').generateGUID
    },
    points: [{ type: mongoose.Schema.Types.Mixed }]
  });
  app.db.model('Territory', territorySchema);
};
