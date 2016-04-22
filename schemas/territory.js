'use strict';

exports = module.exports = function(app, mongoose) {
  var territorySchema = new mongoose.Schema({
    _id: {
      type: String,
      default: require('../utils/helpers').generateGUID
    },
    name: String,
    color: [Number],
    shade: Number,
    path: String,
    links: [{
      type: String,
      ref: 'Link'
    }]
  });
  app.db.model('Territory', territorySchema);
};
