/**
 * Pseudo-rule for metadata extraction: deliverers' IDs.
 */

import type { RuleCheckFunction } from '../../types.js';

// 'self.name' would be 'metadata.deliverers'
export const name = 'metadata.deliverers';

/**
 * @param sr
 * @param done
 */
export const check: RuleCheckFunction<{
    delivererIDs: number[];
}> = async (sr, done) => done({ delivererIDs: await sr.getDelivererIDs() });
