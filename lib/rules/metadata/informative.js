/**
 * Pseudo-rule for metadata extraction: informative.
 */

// 'self.name' would be 'metadata.informative'
exports.name = 'metadata.informative';

exports.check = function (sr, done) {
    const sotd = sr.getSotDSection();
    const expected = /This\s+document\s+is\s+informative\s+only\./;
    let isInformative = false;
    if (!sotd) {
        return done();
    }

    const h2 = sr.getDocumentDateElement();
    const candidate = h2 && sr.norm(h2.textContent).toLowerCase();
    if (candidate && candidate.indexOf('group note') !== -1) {
        isInformative = true;
    }

    return done({
        informative: expected.test(sotd && sotd.textContent) || isInformative,
    });
};
