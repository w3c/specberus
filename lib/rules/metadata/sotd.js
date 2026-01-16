/**
 * Pseudo-rule for metadata extraction: sotd.
 */

/** @import { Specberus } from "../../validator.js" */

export const name = 'metadata.sotd';

/**
 * @param {Specberus} sr
 * @param done
 */
export function check(sr, done) {
    const $sotd = sr.getSotDSection();
    return done({ sotd: $sotd ? sr.norm($sotd.html()) : 'Not found' });
}
