/**
 * Pseudo-rule for metadata extraction: informative.
 */

// 'self.name' would be 'metadata.informative'
exports.name = 'metadata.informative';

exports.check = function (sr, done) {
    const sotd = sr.getSotDSection();
    const expected = /This\s+document\s+is\s+informative\s+only\./;
    let isInformative = false;
    let candidate;
    if (!sotd) {
        return done();
    }

    const SELECTOR_SUBTITLE = 'body div.head h2';
    sr.jsDocument.querySelectorAll(SELECTOR_SUBTITLE).forEach((element) => {
        candidate = sr.norm(element.textContent).toLowerCase();
        if (candidate.indexOf('group note') !== -1) {
            isInformative = true;
        }
    });

    return done({
        informative: expected.test(sotd && sotd.textContent) || isInformative,
    });
};
