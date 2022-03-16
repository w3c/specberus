/**
 * Pseudo-rule for metadata extraction: charters.
 */

// 'self.name' would be 'metadata.charters'

export const name = 'metadata.charters';

/**
 * @param sr
 * @param done
 */
export async function check(sr, done) {
    const charters = await sr.getCharters();

    return done({ charters });
}
