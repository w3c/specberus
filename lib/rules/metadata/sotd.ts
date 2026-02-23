/**
 * Pseudo-rule for metadata extraction: sotd.
 */

import type { RuleCheckFunction } from "../../types.js";


export const name = 'metadata.sotd';

interface SotdMetadata {
    sotd: string;
}

export const check: RuleCheckFunction<SotdMetadata> = (sr, done) => {
    const $sotd = sr.getSotDSection();
    return done({ sotd: $sotd ? sr.norm($sotd.html()!) : 'Not found' });
}
