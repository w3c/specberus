/**
 * Pseudo-rule for metadata extraction: sotd.
 */

export const name = 'metadata.sotd';

/**
 * @param sr
 * @param done
 */
export function check(sr, done) {
    const sotd = sr.getSotDSection();
    return done({ sotd: sotd ? sr.norm(sotd.innerHTML) : 'Not found' });
}
