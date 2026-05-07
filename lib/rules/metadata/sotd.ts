/**
 * Pseudo-rule for metadata extraction: sotd.
 */

import type { RuleCheckFunction } from '../../types.js';

export const name = 'metadata.sotd';

interface SotdMetadata {
    sotd: string;
}

export const check: RuleCheckFunction<SotdMetadata> = sr => {
    const $sotd = sr.getSotDSection();
    return { sotd: $sotd ? sr.norm($sotd.html()!) : 'Not found' };
};
