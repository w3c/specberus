/**
 * Pseudo-rule for metadata extraction: sotd.
 */

import type { RuleCheckFunction } from '../../types.js';

export const name = 'metadata.sotd';

interface SotdMetadata {
    sotd: string;
}

export const check: RuleCheckFunction<SotdMetadata> = context => {
    const $sotd = context.getSotDSection();
    return { sotd: $sotd ? context.norm($sotd.html()!) : 'Not found' };
};
