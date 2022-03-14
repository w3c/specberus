/**
 * Pseudo-rule for metadata extraction: deliverers' IDs.
 */

// 'self.name' would be 'metadata.deliverers'
export const name = 'metadata.deliverers';

/**
 * @param sr
 * @param done
 */
export async function check(sr, done) {
    const ids = await sr.getDelivererIDs();

    done({ delivererIDs: ids });
}
