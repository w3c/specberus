/**
 * Pseudo-rule for metadata extraction: informative.
 */

// 'self.name' would be 'metadata.informative'

exports.check = function(sr, done) {

    var $sotd = sr.getSotDSection()
    ,   expected = /This\s+document\s+is\s+informative\s+only\./;
    if (!$sotd || !$sotd.length) {
        return done();
    }

    return done({informative: expected.test($sotd.text())});
};
