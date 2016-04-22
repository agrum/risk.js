'use strict';

exports = module.exports = function(app, mongoose) {
    //embeddable docs first
    require('./schemas/map')(app, mongoose);
    require('./schemas/link')(app, mongoose);
    require('./schemas/territory')(app, mongoose);
};
