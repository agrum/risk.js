'use strict';

exports = module.exports = function(app, mongoose) {
    //embeddable docs first
    require('./schemas/territory')(app, mongoose);
};
