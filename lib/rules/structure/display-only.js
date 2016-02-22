exports.name = 'structure.display-only';

exports.check = function (sr, done) {

    sr.info(exports.name, 'broken-links');
    sr.info(exports.name, 'customised-paragraph');
    sr.info(exports.name, 'known-disclosures');
    sr.info(exports.name, 'old-pubrules');
    sr.info(exports.name, 'special-box-markup');
    sr.info(exports.name, 'index-list-tables');
    sr.info(exports.name, 'fit-in-a4');
    done();

};
