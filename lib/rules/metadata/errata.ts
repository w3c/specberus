/**
 * Pseudo-rule for metadata extraction: errata.
 */

import type { RuleCheckFunction } from '../../types.js';

// 'self.name' would be 'metadata.errata'

export const name = 'metadata.errata';

interface ErrataMetadata {
    errata: string;
}

export const check: RuleCheckFunction<ErrataMetadata | void> = (sr, done) => {
    const errataRegex = /errata/i;
    const $links = sr.$('body div.head details + p > a');
    const errata = $links
        .toArray()
        .filter(el => errataRegex.test(sr.$(el).text()));
    if (!errata.length || !errata[0].attribs.href) done();
    else done({ errata: errata[0].attribs.href });
};
