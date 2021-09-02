/**
 * Pseudo-rule for metadata extraction: rectrack.
 */

// 'self.name' would be 'metadata.rectrack'

exports.name = 'metadata.rectrack';

exports.check = function (sr, done) {
    const sotd = sr.getSotDSection();
    const expected =
        /The\s+(group\s+does|groups\s+do)\s+not\s+expect\s+this\s+document\s+to\s+become\s+a\s+W3C\s+Recommendation/;
    let isNote = false;
    if (!sotd) {
        return done();
    }

    const h2 = sr.getDocumentStateElement();
    const candidate = h2 && sr.norm(h2.textContent).toLowerCase();
    if (candidate && candidate.indexOf('group note') !== -1) {
        isNote = true;
    }

    return done({
        rectrack: !(expected.test(sotd && sotd.textContent) || isNote),
    });
};
