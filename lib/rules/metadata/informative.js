/**
 * Pseudo-rule for metadata extraction: informative.
 */

// 'self.name' would be 'metadata.informative'
exports.name = "metadata.informative";

exports.check = function(sr, done) {

    var sotd = sr.getSotDSection()
    ,   expected = /This\s+document\s+is\s+informative\s+only\./
    ,   isInformative = false
    ,   candidate;
    if (!sotd || !sotd.length) {
        return done();
    }

    const SELECTOR_SUBTITLE = 'body div.head h2';
    sr.jsDocument.querySelectorAll(SELECTOR_SUBTITLE).forEach(function(element) {
        candidate = sr.norm(element.textContent).toLowerCase();
        if (-1 !== candidate.indexOf("group note")) {
            isInformative = true;
        }
    });

    return done({informative: expected.test(sotd && sotd.textContent) || isInformative});
};
