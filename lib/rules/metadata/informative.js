/**
 * Pseudo-rule for metadata extraction: informative.
 */

// 'self.name' would be 'metadata.informative'
exports.name = 'metadata.informative';

exports.check = function (sr, done) {
    var sotd = sr.getSotDSection();
    var expected = /This\s+document\s+is\s+informative\s+only\./;
    var isInformative = false;
    var candidate;
    if (!sotd) {
        return done();
    }

    const SELECTOR_SUBTITLE = 'body div.head h2';
    sr.jsDocument
        .querySelectorAll(SELECTOR_SUBTITLE)
        .forEach(function (element) {
            candidate = sr.norm(element.textContent).toLowerCase();
            if (candidate.indexOf('group note') !== -1) {
                isInformative = true;
            }
        });

    return done({
        informative: expected.test(sotd && sotd.textContent) || isInformative,
    });
};
