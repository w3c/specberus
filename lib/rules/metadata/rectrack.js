/**
 * Pseudo-rule for metadata extraction: rectrack.
 */

exports.name = 'metadata.rectrack';

exports.check = function(sr, done) {

    var $sotd = sr.getSotDSection()
    ,   expected = /The (group does|groups do) not expect this document to become a W3C Recommendation/;
    if (!$sotd || !$sotd.length) {
        return done();
    }

    return done({rectrack: !expected.test($sotd.text())});
};
