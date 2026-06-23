/**
 * Pseudo-rule for metadata extraction: deliverers' IDs.
 */

import type { RuleCheckFunction } from '../../types.js';

// 'self.name' would be 'metadata.deliverers'
export const name = 'metadata.deliverers';

export const check: RuleCheckFunction<{
    delivererIDs: number[];
}> = async context => ({ delivererIDs: await context.getDelivererIDs() });
