
'use strict';

exports.name = 'structure.name';

exports.check = function (sr, done) {

    var EXPECTED_NAME = /Overview\.html$/;

    if (!EXPECTED_NAME.test(sr.url)) sr.info(exports.name, 'renamed');

    return done();

};

// EOF

