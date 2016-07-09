'use strict';

exports = module.exports = function(app, mongoose) {
  var deepPopulate = require('mongoose-deep-populate')(mongoose);

  var userSchema = new mongoose.Schema({
    _id: {
      type: String,
      default: require('../utils/helpers').generateGUID
    },
    isActive: String,
    username: { type: String, unique: true },
    password: String,
    email: { type: String, unique: true },
    games: [{
        type: String,
        ref: 'Game'
    }]
  });
  userSchema.plugin(deepPopulate, {});

  userSchema.statics.validatePassword = function(password, hash, done) {
    var bcrypt = require('bcrypt');
    bcrypt.compare(password, hash, function(err, res) {
      done(err, res);
    });
  };
  userSchema.statics.encryptPassword = function(password, done) {
    var bcrypt = require('bcrypt');
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return done(err);
      }

      bcrypt.hash(password, salt, function(err, hash) {
        done(err, hash);
      });
    });
  };
  app.db.model('User', userSchema);
};
