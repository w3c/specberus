/**
 * Pseudo-rule for metadata extraction: informative.
 */

// 'self.name' would be 'metadata.informative'
exports.name = "metadata.informative";

exports.check = function(sr, done) {

    var $sotd = sr.getSotDSection()
    ,   expected = /This\s+document\s+is\s+informative\s+only\./
    ,   isInformative = false
    ,   candidate;
    if (!$sotd || !$sotd.length) {
        return done();
    }

    const SELECTOR_SUBTITLE = 'body div.head h2';
    sr.$(SELECTOR_SUBTITLE).each(function() {
        candidate = sr.norm(sr.$(this).text()).toLowerCase();
        if (-1 !== candidate.indexOf("group note")) {
            isInformative = true;
        }
    });

    return done({informative: expected.test($sotd.text()) || isInformative});
};
