/**
 * Pseudo-rule for metadata extraction: rectrack.
 */

// 'self.name' would be 'metadata.rectrack'

exports.check = function(sr, done) {

    var $sotd = sr.getSotDSection()
    ,   expected = /The\s+(group\s+does|groups\s+do)\s+not\s+expect\s+this\s+document\s+to\s+become\s+a\s+W3C\s+Recommendation/
    ,   isNote = false
    ,   candidate;
    if (!$sotd || !$sotd.length) {
        return done();
    }
    const SELECTOR_SUBTITLE = 'body div.head h2';
    sr.$(SELECTOR_SUBTITLE).each(function() {
        candidate = sr.norm(sr.$(this).text()).toLowerCase();
        if (-1 !== candidate.indexOf("group note")) {
            isNote = true;
        }
    });

    return done({rectrack: !(expected.test($sotd.text()) || isNote)});
};
