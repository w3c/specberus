/**
 * Pseudo-rule for metadata extraction: informative.
 */

/** @import { Specberus } from "../../validator.js" */

// 'self.name' would be 'metadata.informative'
export const name = 'metadata.informative';

/**
 * @param {Specberus} sr
 * @param done
 */
export function check(sr, done) {
    const $sotd = sr.getSotDSection();
    const expected = /This\s+document\s+is\s+informative\s+only\./;
    let isInformative = false;
    if (!$sotd) {
        return done();
    }

    const $stateEl = sr.getDocumentStateElement();
    const candidate = $stateEl && sr.norm($stateEl.text()).toLowerCase();
    if (candidate && candidate.indexOf('group note') !== -1) {
        isInformative = true;
    }

    return done({
        informative: expected.test($sotd && $sotd.text()) || isInformative,
    });
}
