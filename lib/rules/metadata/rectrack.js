/**
 * Pseudo-rule for metadata extraction: rectrack.
 */

// 'self.name' would be 'metadata.rectrack'

exports.name = 'metadata.rectrack';

exports.check = function (sr, done) {
    var sotd = sr.getSotDSection();
    var expected = /The\s+(group\s+does|groups\s+do)\s+not\s+expect\s+this\s+document\s+to\s+become\s+a\s+W3C\s+Recommendation/;
    var isNote = false;
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
                isNote = true;
            }
        });

    return done({
        rectrack: !(expected.test(sotd && sotd.textContent) || isNote),
    });
};
