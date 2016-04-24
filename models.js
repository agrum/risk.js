'use strict';

exports = module.exports = function(app, mongoose) {
    //embeddable docs first
    require('./schemas/user')(app, mongoose);
    require('./schemas/map')(app, mongoose);
    require('./schemas/link')(app, mongoose);
    require('./schemas/territory')(app, mongoose);
};
