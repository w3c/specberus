/**
 * Pseudo-rule for metadata extraction: rectrack.
 */

// 'self.name' would be 'metadata.rectrack'

exports.check = function(sr, done) {

    var $sotd = sr.getSotDSection()
    ,   expected = /The\s+(group\s+does|groups\s+do)\s+not\s+expect\s+this\s+document\s+to\s+become\s+a\s+W3C\s+Recommendation/;
    if (!$sotd || !$sotd.length) {
        return done();
    }

    return done({rectrack: !expected.test($sotd.text())});
};
