
'use strict';

exports.name = 'structure.display-only';

exports.check = function (sr, done) {

    sr.info(exports.name, 'broken-links');
    sr.info(exports.name, 'customised-paragraph');
    sr.info(exports.name, 'known-disclosures');
    sr.info(exports.name, 'old-pubrules');
    return done();

};

