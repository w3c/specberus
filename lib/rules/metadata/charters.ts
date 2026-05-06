/**
 * Pseudo-rule for metadata extraction: charters.
 */

import type { RuleCheckFunction } from '../../types.js';

// 'self.name' would be 'metadata.charters'

export const name = 'metadata.charters';

export const check: RuleCheckFunction<{
    charters: string[];
}> = async (sr, done) => done({ charters: await sr.getCharters() });
