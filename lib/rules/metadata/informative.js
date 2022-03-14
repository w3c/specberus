/**
 * Pseudo-rule for metadata extraction: informative.
 */

// 'self.name' would be 'metadata.informative'
export const name = 'metadata.informative';

/**
 * @param sr
 * @param done
 */
export function check(sr, done) {
    const sotd = sr.getSotDSection();
    const expected = /This\s+document\s+is\s+informative\s+only\./;
    let isInformative = false;
    if (!sotd) {
        return done();
    }

    const stateEle = sr.getDocumentStateElement();
    const candidate = stateEle && sr.norm(stateEle.textContent).toLowerCase();
    if (candidate && candidate.indexOf('group note') !== -1) {
        isInformative = true;
    }

    return done({
        informative: expected.test(sotd && sotd.textContent) || isInformative,
    });
}
